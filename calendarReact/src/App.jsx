import { BrowserRouter, Routes, Route } from "react-router-dom";
import MonthCalendar from "@/components/Calendar/MonthCalendar";
import WeekCalendar from "@/components/Calendar/WeekCalendar";
import DayCalendar from "@/components/Calendar/DayCalendar";
import Layout from "@/components/Layout/Layout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<MonthCalendar />} />
          <Route path="/month/:year/:month/:day" element={<MonthCalendar />} />
          <Route path="/week/:year/:month/:day" element={<WeekCalendar />} />
          <Route path="/day/:year/:month/:day" element={<DayCalendar />} />
        </Route>
      </Routes>
    </BrowserRouter>

  )
}

export default App
