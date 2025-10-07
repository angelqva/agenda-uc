"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Custom hook to manage active scroll section for the navbar.
 * Listens to scroll events and determines which section is currently in view.
 * Uses throttling to improve performance and make updates more fluent.
 */
export function useNavbarBasic() {
    const [activeScrollId, setActiveScrollId] = useState<string | null>("inicio");

    const updateActiveSection = useCallback(() => {
        const sections = document.querySelectorAll("section");
        let currentSection: string | null = null;

        sections.forEach((section) => {
            const rect = section.getBoundingClientRect();
            // Consider a section active if its top is above the viewport and bottom is below
            if (rect.top <= 200 && rect.bottom > 200) {
                currentSection = section.id;
            }
        });

        setActiveScrollId(currentSection);
    }, []);

    const scrollToSection = useCallback((id: string) => {
        const element = document.getElementById(id);
        if (element) {
            const rect = element.getBoundingClientRect();
            const offsetTop = window.pageYOffset + rect.top - 100;
            const scrollTop = Math.max(0, offsetTop);

            // Smooth scroll animation with easing
            const startPosition = window.pageYOffset;
            const distance = scrollTop - startPosition;
            const duration = 800; // ms
            let startTime: number | null = null;

            const easeInOutQuad = (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

            const animation = (currentTime: number) => {
                if (startTime === null) startTime = currentTime;
                const timeElapsed = currentTime - startTime;
                const progress = Math.min(timeElapsed / duration, 1);
                const easeProgress = easeInOutQuad(progress);

                window.scrollTo(0, startPosition + distance * easeProgress);

                if (progress < 1) {
                    requestAnimationFrame(animation);
                }
            };

            requestAnimationFrame(animation);
        }
    }, []);

    useEffect(() => {
        // Throttle scroll updates for better performance
        let ticking = false;

        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    updateActiveSection();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        // Initial check
        updateActiveSection();

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [updateActiveSection]);

    useEffect(() => {
        // Handle initial navigation with hash
        const hash = window.location.hash.slice(1); // remove #
        if (hash) {
            scrollToSection(hash);
        }
    }, [scrollToSection]);

    return { activeScrollId, scrollToSection };
}
