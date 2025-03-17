import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { closeEventModal } from '@/features/eventModal/eventModalSlice';
import Header from "@/components/Header/Header";
import EventModal from '@/components/Modals/EventModal';
import EventDetailsModal from '@/components/Modals/EventDetailsModal';
import { VIEW_TYPE_WEEK, VIEW_TYPE_DAY, VIEW_TYPE_MONTH, MODAL_TYPE_ADD, MODAL_TYPE_EDIT, MODAL_TYPE_DISPLAY } from '@/constants';

function Layout() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const dispatch = useDispatch();
  const eventModal = useSelector((state) => state.eventModal);
  const location = useLocation();

  const viewType = (() => {
    const pathSegments = location.pathname.split("/");
    switch (pathSegments[1]) {
      case "week":
        return VIEW_TYPE_WEEK;
      case "day":
        return VIEW_TYPE_DAY;
      default:
        return VIEW_TYPE_MONTH;
    }
  })();

  return (
    <div className="min-h-screen flex flex-col">
      <Header viewType={viewType} currentDate={currentDate} onDateChange={setCurrentDate} />
      {eventModal.isModalOpen && (eventModal.modalType === MODAL_TYPE_ADD || eventModal.modalType === MODAL_TYPE_EDIT) && (
        <EventModal onClose={() => dispatch(closeEventModal())} />
      )}
      {eventModal.isModalOpen && eventModal.modalType === MODAL_TYPE_DISPLAY && (
        <EventDetailsModal onClose={() => dispatch(closeEventModal())} />
      )}

      <Outlet context={{ viewType, currentDate }} className="flex-1" />
    </div>
  )

}

export default Layout