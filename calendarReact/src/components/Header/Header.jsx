import {
  format, addMonths, subMonths, addWeeks, subWeeks, addDays, subDays, startOfWeek, endOfWeek, isValid,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { openEventModal } from "@/features/eventModal/eventModalSlice";
import { VIEW_TYPE_WEEK, VIEW_TYPE_DAY, VIEW_TYPE_MONTH, MODAL_TYPE_ADD, MODAL_TYPE_EDIT, MODAL_TYPE_DISPLAY } from '@/constants';


function Header({ onDateChange, currentDate = new Date() }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { year, month, day } = useParams();

  // Build date from route params or fallback
  const yearInt = parseInt(year, 10);
  const monthInt = parseInt(month, 10);
  const dayInt = parseInt(day, 10);
  const routeDate = new Date(yearInt, (monthInt || 1) - 1, dayInt || 1);
  const finalDate = isValid(routeDate) ? routeDate : currentDate;

  const pathSegments = location.pathname.split("/");
  const viewType = pathSegments[1] || VIEW_TYPE_MONTH;

  // Building param-based route
  const getRoute = (view, dateObj) => {
    const y = dateObj.getFullYear();
    const m = dateObj.getMonth() + 1;
    const d = dateObj.getDate();
    return `/${view}/${y}/${m}/${d}`;
  };

  // Navigating to prev month,week or day
  const handlePrev = () => {
    let newDate = finalDate;
    if (viewType === VIEW_TYPE_MONTH) {
      newDate = subMonths(finalDate, 1);
      navigate(getRoute(VIEW_TYPE_MONTH, newDate));
    } else if (viewType === VIEW_TYPE_WEEK) {
      newDate = subWeeks(finalDate, 1);
      navigate(getRoute(VIEW_TYPE_WEEK, newDate));
    } else if (viewType === VIEW_TYPE_DAY) {
      newDate = subDays(finalDate, 1);
      navigate(getRoute(VIEW_TYPE_DAY, newDate));
    }
    onDateChange(newDate);
  };

  // Navigating to next month,week or day
  const handleNext = () => {
    let newDate = finalDate;
    if (viewType === "month") {
      newDate = addMonths(finalDate, 1);
      navigate(getRoute("month", newDate));
    } else if (viewType === "week") {
      newDate = addWeeks(finalDate, 1);
      navigate(getRoute("week", newDate));
    } else if (viewType === "day") {
      newDate = addDays(finalDate, 1);
      navigate(getRoute("day", newDate));
    }
    onDateChange(newDate);
  };

  // Gets the title for the Header
  const getTitle = () => {
    if (viewType === VIEW_TYPE_MONTH) {
      return format(finalDate, "MMMM yyyy");
    } else if (viewType === VIEW_TYPE_WEEK) {
      const start = format(startOfWeek(finalDate), "d MMM, yy");
      const end = format(endOfWeek(finalDate), "d MMM, yy");
      return `${start} - ${end}`;
    } else if (viewType === VIEW_TYPE_DAY) {
      return format(finalDate, "d MMMM yyyy");
    }
    return "";
  };

  const handleSelect = (e) => {
    const newView = e.target.value;
    navigate(getRoute(newView, finalDate));
  };

  const handleAddEvent = () => {
    dispatch(
      openEventModal({
        modalType: MODAL_TYPE_ADD,
        eventInfo: {
          eventDate: format(finalDate, "yyyy-MM-dd"),
        },
      })
    );
  };

  // Navigates to today
  const handleToday = () => {
    const today = new Date();
    onDateChange(today);
    navigate(getRoute(viewType, today));
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-white shadow rounded-b-lg">
      {/* Previous & Next */}
      <div className="flex items-center space-x-1">
        <button className="p-2 rounded-full hover:bg-gray-300 cursor-pointer" onClick={handlePrev}>
          <ChevronLeft size={24} />
        </button>
        <button className="p-2 rounded-full hover:bg-gray-300 cursor-pointer" onClick={handleNext}>
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Title */}
      <span className="text-xl font-semibold text-center min-w-[180px]">
        {getTitle()}
      </span>

      <div className="flex items-center space-x-2">
        <button
          onClick={handleAddEvent}
          className="bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-600 cursor-pointer"
        >
          Add Event
        </button>
        <button
          onClick={handleToday}
          className="border border-gray-300 p-2 px-4 rounded-full hover:bg-gray-300 cursor-pointer"
        >
          Today
        </button>
        <select
          value={viewType}
          className="border border-gray-300 p-2 rounded-full hover:bg-gray-300 cursor-pointer"
          onChange={handleSelect}
        >
          <option value="month">Month</option>
          <option value="week">Week</option>
          <option value="day">Day</option>
        </select>
      </div>
    </div>
  );
}

export default Header;
