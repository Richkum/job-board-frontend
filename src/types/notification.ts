export interface Notification {
  _id: string;
  type:
    | "newApplication"
    | "applicationStatusUpdate"
    | "newJobMatch"
    | "applicationDeadlineReminder"
    | "interviewScheduled"
    | "jobStatusUpdate"
    | "newMessage"
    | "other";
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  relatedJob?: {
    _id: string;
    title: string;
  };
  relatedApplication?: {
    _id: string;
    status: string;
  };
  actionUrl?: string;
  priority: "low" | "medium" | "high";
}
