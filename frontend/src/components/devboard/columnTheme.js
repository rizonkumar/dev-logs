import { Circle, Clock, AlertCircle, CheckCircle } from "lucide-react";

export const COLUMN_THEME = {
  TODO: {
    title: "To Do",
    icon: Circle,
    color: "blue",
    headerClasses:
      "border-blue-500 bg-gradient-to-r from-blue-500/15 to-blue-400/15 text-blue-900 dark:text-blue-100 dark:border-blue-400/60 dark:from-blue-500/25 dark:to-blue-400/25",
    iconClasses: "text-blue-700 dark:text-blue-300",
    badgeClasses:
      "bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200/50 dark:border-blue-800/50",
  },
  IN_PROGRESS: {
    title: "In Progress",
    icon: Clock,
    color: "yellow",
    headerClasses:
      "border-yellow-500 bg-gradient-to-r from-yellow-500/15 to-yellow-400/15 text-yellow-900 dark:text-yellow-100 dark:border-yellow-400/60 dark:from-yellow-500/25 dark:to-yellow-400/25",
    iconClasses: "text-yellow-700 dark:text-yellow-300",
    badgeClasses:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-950/30 dark:text-yellow-300 border border-yellow-200/50 dark:border-yellow-800/50",
  },
  IN_REVIEW: {
    title: "In Review",
    icon: AlertCircle,
    color: "purple",
    headerClasses:
      "border-purple-500 bg-gradient-to-r from-purple-500/15 to-purple-400/15 text-purple-900 dark:text-purple-100 dark:border-purple-400/60 dark:from-purple-500/25 dark:to-purple-400/25",
    iconClasses: "text-purple-700 dark:text-purple-300",
    badgeClasses:
      "bg-purple-100 text-purple-800 dark:bg-purple-950/40 dark:text-purple-300 border border-purple-200/50 dark:border-purple-800/50",
  },
  DONE: {
    title: "Done",
    icon: CheckCircle,
    color: "green",
    headerClasses:
      "border-green-500 bg-gradient-to-r from-green-500/15 to-green-400/15 text-green-900 dark:text-green-100 dark:border-green-400/60 dark:from-green-500/25 dark:to-green-400/25",
    iconClasses: "text-green-700 dark:text-green-300",
    badgeClasses:
      "bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-300 border border-green-200/50 dark:border-green-800/50",
  },
};
