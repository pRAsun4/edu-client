import React, { useEffect, useRef } from 'react';

export const FilterModal = ({ isOpen, onClose, children, className }) => {
    const modalRef = useRef();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className={`filterModal ${className}`} ref={modalRef}>
            <div className="filterModal_content">{children}</div>
        </div>
    );
};