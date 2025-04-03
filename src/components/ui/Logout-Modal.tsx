"use client";

import React, { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-bgCard dark:bg-bgCard-dark p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-bold mb-4">{title}</h2>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
