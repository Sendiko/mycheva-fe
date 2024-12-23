"use client";
import Calendar from "@/app/components/calendar/calendar";
import MeetingCard from "@/app/components/calendar/event";
import CalendarFAB from "@/app/components/calendar/fab";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axiosInstance from "@/app/lib/axios";
import AddIcon from "@mui/icons-material/Add";
import Link from "next/link";

export default function Meetings() {
  const router = useRouter();
  const path = usePathname();

  const [meetings, setMeetings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    const token = Cookies.get("token");

    axiosInstance
      .get("event", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setMeetings(res.data.events);
        setLoading(false);
      })
      .catch((error: any) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const handleNewEvent = () => {
    router.push(path + "/post");
  };

  return (
    <div className="flex flex-col lg:flex-row sm:flex-col w-full">
      <div className="flex flex-col gap-2">
        <CalendarFAB onClick={handleNewEvent} />
        <Calendar />
      </div>
      <div className="flex flex-col w-full">
        {loading && (
          <p className="bg-info p-4 m-4 rounded-lg text-white">loading...</p>
        )}
        {error && (
          <p className="bg-error p-4 m-4 rounded-lg text-white">{error}</p>
        )}
        {meetings.map((meeting) => (
          <MeetingCard
            title={meeting.name}
            time={meeting.time.slice(0, -3)}
            key={meeting.id}
            date={meeting.date}
            id={meeting.id}
          ></MeetingCard>
        ))}
      </div>
    </div>
  );
}
