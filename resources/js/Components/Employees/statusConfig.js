import {
  Users,
  CheckCircle2,
  PauseCircle,
  Clock,
  XCircle,
  LogOut,
  Award,
  FileX,
} from "lucide-react";

export const STATUS_CONFIG = {
  total: {
    label: "Total employees",
    icon: Users,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-500",
  },
  active: {
    label: "Active",
    icon: CheckCircle2,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-500",
  },
  on_leave: {
    label: "On Leave",
    icon: Clock,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-500",
  },
  inactive: {
    label: "Inactive",
    icon: PauseCircle,
    iconBg: "bg-gray-100",
    iconColor: "text-gray-500",
  },
  contract_end: {
    label: "Contract Ended",
    icon: FileX,
    iconBg: "bg-orange-50",
    iconColor: "text-orange-500",
  },
  resigned: {
    label: "Resigned",
    icon: LogOut,
    iconBg: "bg-rose-50",
    iconColor: "text-rose-500",
  },
  terminated: {
    label: "Terminated",
    icon: XCircle,
    iconBg: "bg-red-50",
    iconColor: "text-red-500",
  },
  retired: {
    label: "Retired",
    icon: Award,
    iconBg: "bg-violet-50",
    iconColor: "text-violet-500",
  },
};

// Order in which stat cards are displayed — 8 entries = clean 4x2 grid
export const STATUS_ORDER = [
  "total",
  "active",
  "on_leave",
  "inactive",
  "contract_end",
  "resigned",
  "terminated",
  "retired",
];