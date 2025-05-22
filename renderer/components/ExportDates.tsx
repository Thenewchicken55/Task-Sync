"use client";

import React, { useState } from "react";
import { CSVLink } from 'react-csv';
import Image from "next/image"
import { Todo } from "../types/todo";

export default function ExportDates({allTasks}: {allTasks: Todo[]}) {

    const filteredData = allTasks.map(({ title, date, endDate, duration }) => ({ title, date, endDate, duration }));



    return (
        <CSVLink 
            className="w-full justify-center inline-flex items-center px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-all duration-200 shadow-sm hover:shadow-md group cursor-pointer"
            data={filteredData} 
            filename={"exported-data.csv"} 
            target="_blank" 
        >
            <Image src="/upload2.svg" width={15} height={15} alt="upload icon" />
            <div className="pl-2">
                Export Dates
            </div>
        </CSVLink>
    )
} 