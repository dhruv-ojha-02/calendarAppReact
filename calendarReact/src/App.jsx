import { BrowserRouter, Routes, Route } from "react-router-dom";
import MonthCalendar from "@/components/Calendar/MonthCalendar";
import WeekCalendar from "@/components/Calendar/WeekCalendar";
import DayCalendar from "@/components/Calendar/DayCalendar";
import Layout from "@/components/Layout/Layout";
import { VIEW_TYPE_WEEK, VIEW_TYPE_DAY, VIEW_TYPE_MONTH } from '@/constants';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<MonthCalendar />} />
          <Route path={`/${VIEW_TYPE_MONTH}/:year/:month/:day`} element={<MonthCalendar />} />
          <Route path={`/${VIEW_TYPE_WEEK}/:year/:month/:day`} element={<WeekCalendar />} />
          <Route path={`/${VIEW_TYPE_DAY}/:year/:month/:day`} element={<DayCalendar />} />
        </Route>
      </Routes>
    </BrowserRouter>

  )
}

export default App
