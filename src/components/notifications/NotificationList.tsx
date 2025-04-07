"use client";

import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Bell } from "lucide-react";
import { useNotifications } from "@/context/NotificationContext";

export const NotificationList = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative text-text/85 hover:text-primary dark:text-text-dark dark:hover:text-white"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-danger rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-bgCard dark:bg-bgCard-dark rounded-lg shadow-xl z-50">
          <div className="p-4 border-b border-border dark:border-border-dark">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-text dark:text-text-dark">
                Notifications
              </h3>
              {notifications.length > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-primary dark:text-primary-dark hover:text-primary-dark dark:hover:text-primary transition-colors"
                >
                  Mark all as read
                </button>
              )}
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-textMuted dark:text-textMuted-dark">
                No notifications
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification._id}
                  onClick={() => {
                    if (!notification.read) {
                      markAsRead(notification._id);
                    }
                    if (notification.actionUrl) {
                      window.location.href = notification.actionUrl;
                    }
                  }}
                  className={`p-4 border-b border-border dark:border-border-dark cursor-pointer ${
                    notification.read
                      ? "bg-bgCard"
                      : "bg-primary-light dark:bg-primary-dark"
                  } hover:bg-bgSecondary dark:hover:bg-bgSecondary-dark transition-colors`}
                >
                  <div className="flex items-start gap-x-4">
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-text dark:text-text-dark">
                        {notification.title}
                      </p>
                      <p className="text-sm text-textSecondary dark:text-textSecondary-dark">
                        {notification.message}
                      </p>
                      <p className="text-xs text-textMuted dark:text-textMuted-dark mt-1">
                        {formatDistanceToNow(new Date(notification.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-primary-dark rounded-full mt-2" />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
