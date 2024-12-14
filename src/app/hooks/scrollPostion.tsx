import { useEffect, useState } from 'react';

export function useScrollPosition() {
    const [scrollPosition, setScrollPosition] = useState<number>(0);

    useEffect(() => {
        const handleScroll = () => {
            const element = document.getElementById("myDiv");
            if (element) {
                const scrollTop = element.scrollTop;
                const scrollHeight = element.scrollHeight;
                const clientHeight = element.clientHeight;

                // Calculate the percentage of scrolled height
                const height = scrollHeight - clientHeight;
                const scrolled = (scrollTop / height) * 100;
                setScrollPosition(scrolled || 0);
            }
        };

        const element = document.getElementById("myDiv");
        if (element) {
            element.addEventListener("scroll", handleScroll);
        }

        return () => {
            if (element) {
                element.removeEventListener("scroll", handleScroll);
            }
        };
    }, []);

    return scrollPosition;
}
