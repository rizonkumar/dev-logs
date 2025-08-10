import { Circle, Clock, AlertCircle, CheckCircle } from "lucide-react";

export const COLUMN_THEME = {
  TODO: {
    title: "To Do",
    icon: Circle,
    color: "blue",
    headerClasses:
      "border-blue-500 text-blue-700 dark:text-blue-300 dark:border-blue-400/60",
    iconClasses: "text-blue-500 dark:text-blue-400",
    badgeClasses:
      "bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300",
  },
  IN_PROGRESS: {
    title: "In Progress",
    icon: Clock,
    color: "yellow",
    headerClasses:
      "border-yellow-500 text-yellow-700 dark:text-yellow-300 dark:border-yellow-400/60",
    iconClasses: "text-yellow-500 dark:text-yellow-400",
    badgeClasses:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-950/40 dark:text-yellow-300",
  },
  IN_REVIEW: {
    title: "In Review",
    icon: AlertCircle,
    color: "purple",
    headerClasses:
      "border-purple-500 text-purple-700 dark:text-purple-300 dark:border-purple-400/60",
    iconClasses: "text-purple-500 dark:text-purple-400",
    badgeClasses:
      "bg-purple-100 text-purple-800 dark:bg-purple-950/40 dark:text-purple-300",
  },
  DONE: {
    title: "Done",
    icon: CheckCircle,
    color: "green",
    headerClasses:
      "border-green-500 text-green-700 dark:text-green-300 dark:border-green-400/60",
    iconClasses: "text-green-500 dark:text-green-400",
    badgeClasses:
      "bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-300",
  },
};
