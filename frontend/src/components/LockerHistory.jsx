import React, { useState, useContext, useRef, useEffect } from 'react';
import { AdminContext } from "../context/AdminProvider";
import ReactPaginate from 'react-paginate';
import Layout from "./Layout";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';
import { MdListAlt } from 'react-icons/md';
import { Loader2 } from 'lucide-react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { parse, format } from 'date-fns';
import "font-awesome/css/font-awesome.min.css";

const LockerHistory = () => {
    const { lockerHistory, clearHistory, getLockerHistory } = useContext(AdminContext);
    const [searchLocker, setSearchTermLocker] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [clearStartDate, setClearStartDate] = useState("");
    const [clearEndDate, setClearEndDate] = useState("");
    const [showClearHistorySection, setShowClearHistorySection] = useState(false);
    const [clearSuccess, setClearSuccess] = useState(false);
    const clearHistoryRef = useRef(null);
    const startDatePickerRef = useRef(null);
    const endDatePickerRef = useRef(null);
    const clearStartDatePickerRef = useRef(null);
    const clearEndDatePickerRef = useRef(null);

    const isHistoryLoading = lockerHistory === null;

    let filterHistory = lockerHistory?.history || [];
    filterHistory = filterHistory.filter((item) => {
        return !searchLocker || String(item.LockerNumber).includes(searchLocker.toString());
    });

    const fdate = (Dat) => {
        const date = new Date(Dat);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        const formattedCreatedDate = `${day}-${month}-${year}`;
        return formattedCreatedDate;
    }

    if (startDate && endDate) {
        if (startDate > endDate) {
            alert("Start date cannot be greater than end date.");
            setTimeout(() => {
                setStartDate("");
                setEndDate("");
            }, 1500);
        }else{
            filterHistory = filterHistory.filter((item) => {
                const createdAt = fdate(item.createdAt)
                return createdAt >= startDate && createdAt <= endDate;
            });
        }
    } else if(startDate && !endDate) {
        filterHistory = filterHistory.filter((item) => {
            const createdAt = fdate(item.createdAt)
            return createdAt >= startDate;
        });
    } else if(!startDate && endDate) {
        filterHistory = filterHistory.filter((item) => {
            const createdAt = fdate(item.createdAt)
            return createdAt <= endDate;
        });
    }

    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 10;

    const pageCount = Math.ceil(filterHistory.length / itemsPerPage);
    const currentItems = filterHistory.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

    const startRange = currentPage * itemsPerPage + 1;
    const endRange = Math.min((currentPage + 1) * itemsPerPage, filterHistory.length);

    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };

    useEffect(() => {
        if (clearSuccess) {
            toast.success("History cleared successfully");
            setClearSuccess(false);
            // Reload history data
            if (getLockerHistory) {
                getLockerHistory();
            }
        }
    }, [clearSuccess, getLockerHistory]);

    const handleReset = () => {
        setStartDate(null);
        setEndDate(null);
    };

    const handleReset1 = () => {
        setClearStartDate(null);
        setClearEndDate(null);
    };

    const parseDate = (dateString) => {
        if (!dateString) return null;
        return parse(dateString, "dd-MM-yyyy", new Date());
    };

    const parseDate1 = (dateString) => {
        if (!dateString) return null;
        return parse(dateString, "yyyy-MM-dd", new Date());
    };

    const handleClearHistory = async () => {
        if (!clearStartDate || !clearEndDate || clearStartDate > clearEndDate) {
            alert("Please select a valid date range");
            setTimeout(() => {
                setClearStartDate("");
                setClearEndDate("");
            }, 1500);
        } else {
            let clearStartDate1 = new Date(`${clearStartDate}T00:00:00`);
            let clearEndDate1 = new Date(`${clearEndDate}T23:59:59.999`);

            // Convert them to UTC format
            let clearStartDateUTC = clearStartDate1.toISOString();
            let clearEndDateUTC = clearEndDate1.toISOString();

            const resp = await clearHistory(clearStartDateUTC, clearEndDateUTC);
            if (resp) {
                setClearStartDate("");
                setClearEndDate("");
                setShowClearHistorySection(false);
                setClearSuccess(true);
            } else {
                alert("Failed to clear history. Please try again.");
            }
        }
    };

    const handleScrollToClearHistory = () => {
        // Scroll to the clear history block
        if (clearHistoryRef.current) {
          clearHistoryRef.current.scrollIntoView({ behavior: 'smooth' });
          setShowClearHistorySection(true);
        }
    };

    return (
        <Layout>
            <ToastContainer position="top-right" autoClose={2000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="colored" />
            <section className="flex flex-col w-full px-2 sm:px-4 py-6 sm:py-12 gap-4">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 text-center">
                    Locker History
                </h1>
                <div className="w-full overflow-x-auto">
                    <div className="bg-white rounded-2xl shadow-xl relative overflow-hidden">
                        <div className="sticky top-0 z-10 bg-white flex flex-col sm:flex-row justify-between items-stretch sm:items-center p-2 sm:p-4 gap-2 sm:gap-4 border-b border-gray-200 rounded-t-2xl">
                            <input
                                type="text"
                                name="searchLocker"
                                placeholder="Search By Locker Number"
                                className="border-2 border-black w-full sm:w-[15rem] px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg shadow-sm focus:outline-none text-sm sm:text-base"
                                value={searchLocker}
                                onChange={(e) => setSearchTermLocker(e.target.value)}
                            />
                            <form className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
                                <div className="relative">
                                    <DatePicker
                                        ref={startDatePickerRef}
                                        selected={parseDate(startDate)}
                                        onChange={(date) => setStartDate(format(date, "dd-MM-yyyy"))}
                                        selectsStart
                                        startDate={parseDate(startDate)}
                                        endDate={parseDate(endDate)}
                                        dateFormat="dd-MM-yyyy"
                                        placeholderText="Start Date"
                                        showMonthDropdown
                                        showYearDropdown
                                        dropdownMode="select"
                                        className="w-full sm:w-[12rem] p-2 border-2 border-black rounded-lg cursor-pointer text-sm sm:text-base"
                                    />
                                    <i 
                                        className="fa fa-calendar absolute right-3 top-3 text-gray-700 cursor-pointer hover:text-gray-900" 
                                        onClick={() => startDatePickerRef.current?.input?.focus()}
                                    />
                                </div>
                                <div className="relative">
                                    <DatePicker
                                        ref={endDatePickerRef}
                                        selected={parseDate(endDate)}
                                        onChange={(date) => setEndDate(format(date, "dd-MM-yyyy"))}
                                        selectsEnd
                                        startDate={parseDate(startDate)}
                                        endDate={parseDate(endDate)}
                                        minDate={parseDate(startDate)}
                                        dateFormat="dd-MM-yyyy"
                                        placeholderText="End Date"
                                        showMonthDropdown
                                        showYearDropdown
                                        dropdownMode="select"
                                        className="w-full sm:w-[12rem] p-2 border-2 border-black rounded-lg cursor-pointer text-sm sm:text-base"
                                    />
                                    <i 
                                        className="fa fa-calendar absolute right-3 top-3 text-gray-700 cursor-pointer hover:text-gray-900" 
                                        onClick={() => endDatePickerRef.current?.input?.focus()}
                                    />
                                </div>
                                <button
                                    onClick={handleReset}
                                    className="px-3 sm:px-4 py-1.5 sm:py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm sm:text-base whitespace-nowrap"
                                >
                                    Reset
                                </button>
                                <button
                                    onClick={handleScrollToClearHistory}
                                    className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm sm:text-base whitespace-nowrap"
                                >
                                    Clear History
                                </button>
                            </form>
                        </div>
                        
                        {isHistoryLoading ? (
                            <div className="px-2 sm:px-4 py-12 sm:py-16 flex flex-col items-center justify-center gap-4">
                                <Loader2 className="w-12 h-12 sm:w-14 sm:h-14 text-purple-600 animate-spin" />
                                <p className="text-gray-600 text-sm sm:text-base font-medium">Loading history...</p>
                            </div>
                        ) : filterHistory.length === 0 ? (
                            <div className="px-2 sm:px-4 py-6 sm:py-8 text-center text-gray-500 text-sm sm:text-base">
                                No History Found.
                            </div>
                        ) : (
                            <>
                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse min-w-[900px]">
                                        <thead className="sticky z-1">
                                            <tr className="bg-gray-300 text-black">
                                                <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-semibold border-b border-gray-500 text-xs sm:text-sm">Locker ID</th>
                                                <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-semibold border-b border-gray-500 text-xs sm:text-sm">Message</th>
                                                <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-semibold border-b border-gray-500 text-xs sm:text-sm">Locker Holder</th>
                                                <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-semibold border-b border-gray-500 text-xs sm:text-sm">Initiated By</th>
                                                <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-semibold border-b border-gray-500 text-xs sm:text-sm">Cost</th>
                                                <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-semibold border-b border-gray-500 text-xs sm:text-sm">Status</th>
                                                <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-semibold border-b border-gray-500 text-xs sm:text-sm">Date & Time</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-gray-50">
                                            {currentItems.map((item, index) => (
                                                <tr key={index} className="border-b border-gray-200 hover:bg-gray-100 transition-colors bg-white">
                                                    <td className="px-2 sm:px-4 py-2 sm:py-3 text-gray-800 font-medium text-xs sm:text-sm">{item.LockerNumber}</td>
                                                    <td className="px-2 sm:px-4 py-2 sm:py-3 text-gray-700 font-semibold text-xs sm:text-sm truncate max-w-[150px] sm:max-w-none">{item.comment}</td>
                                                    <td className="px-2 sm:px-4 py-2 sm:py-3 text-gray-700 font-semibold text-xs sm:text-sm truncate max-w-[120px] sm:max-w-none">{item.LockerHolder}</td>
                                                    <td className="px-2 sm:px-4 py-2 sm:py-3 text-gray-700 font-semibold text-xs sm:text-sm truncate max-w-[120px] sm:max-w-none">{item.InitiatedBy}</td>
                                                    <td className="px-2 sm:px-4 py-2 sm:py-3 text-gray-700 font-semibold text-xs sm:text-sm">{item.Cost}</td>
                                                    <td className="px-2 sm:px-4 py-2 sm:py-3 text-gray-700 font-semibold text-xs sm:text-sm">{item.LockerStatus}</td>
                                                    <td className="px-2 sm:px-4 py-2 sm:py-3 text-gray-700 font-semibold text-xs sm:text-sm">
                                                        {item.createdAt
                                                            ? ((() => {
                                                                    const date = new Date(item.createdAt);
                                                                    const day = String(date.getDate()).padStart(2, "0");
                                                                    const month = String(date.getMonth() + 1).padStart(2, "0");
                                                                    const year = date.getFullYear();
                                                                    const hours = String(date.getHours()).padStart(2, "0");
                                                                    const minutes = String(date.getMinutes()).padStart(2, "0");
                                                                    return (
                                                                        <div className="flex flex-col">
                                                                            <span>{`${day}/${month}/${year}`}</span>
                                                                            <span>{`${hours}:${minutes}`}</span>
                                                                        </div>
                                                                    );
                                                                })()
                                                            ) : (
                                                                "N/A"
                                                            )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="p-2 sm:p-4 border-t border-gray-200">
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-start gap-3 sm:gap-4">
                                        <div className="flex items-center gap-2 text-gray-600 text-xs sm:text-sm">
                                            <MdListAlt className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                                            <span>Showing <strong>{startRange}</strong>–<strong>{endRange}</strong> of <strong>{filterHistory.length}</strong> logs</span>
                                        </div>
                                        <ReactPaginate
                                            breakLabel={<span className='mr-2 sm:mr-4'>...</span>}
                                            previousLabel={
                                                <span className='w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-md bg-lightGray mr-2 sm:mr-4'>
                                                    <BsChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                                                </span>
                                            }
                                            nextLabel={
                                                <span className='w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-md bg-lightGray mr-2 sm:mr-4'>
                                                    <BsChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                                                </span>
                                            }
                                            pageCount={pageCount}
                                            onPageChange={handlePageClick}
                                            pageRangeDisplayed={3}
                                            marginPagesDisplayed={1}
                                            containerClassName="flex items-center gap-1 sm:gap-2"
                                            pageClassName="block border border-solid border-lightGray hover:bg-lightGray w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-md text-xs sm:text-sm"
                                            activeClassName="bg-purple-800 text-white"
                                            renderOnZeroPageCount={null}
                                        />
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {filterHistory.length > 0 && (
                    <div className="w-full flex flex-col items-center gap-3 sm:gap-4">
                        {!showClearHistorySection && (
                            <div className="text-center px-2">
                                <p className="text-sm sm:text-base md:text-lg">
                                    Need to clear history?{' '}
                                    <button
                                        onClick={handleScrollToClearHistory}
                                        className="text-gray-500 underline hover:text-gray-700"
                                    >
                                        Click here
                                    </button>
                                </p>
                            </div>
                        )}

                        <div
                            ref={clearHistoryRef} 
                            className={`w-full max-w-md bg-white p-4 sm:p-6 md:p-8 rounded-2xl shadow-xl ${
                                showClearHistorySection ? '' : 'hidden'
                            }`}
                        >
                            <div className="flex flex-col items-center gap-3 sm:gap-4">
                                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 text-center">Delete Locker History</h2>
                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 w-full">
                                    <div className="relative w-full">
                                        <DatePicker
                                            ref={clearStartDatePickerRef}
                                            selected={parseDate1(clearStartDate)}
                                            onChange={(date) => setClearStartDate(format(date, "yyyy-MM-dd"))}
                                            selectsStart
                                            startDate={parseDate1(clearStartDate)}
                                            endDate={parseDate1(clearEndDate)}
                                            dateFormat="yyyy-MM-dd"
                                            placeholderText="Start Date"
                                            showMonthDropdown
                                            showYearDropdown
                                            dropdownMode="select"
                                            className="w-full p-2 border-2 border-black rounded-lg cursor-pointer text-sm sm:text-base"
                                        />
                                        <i 
                                            className="fa fa-calendar absolute right-3 top-3 text-gray-700 cursor-pointer hover:text-gray-900" 
                                            onClick={() => clearStartDatePickerRef.current?.input?.focus()}
                                        />
                                    </div>
                                    
                                    <div className="relative w-full">
                                        <DatePicker
                                            ref={clearEndDatePickerRef}
                                            selected={parseDate1(clearEndDate)}
                                            onChange={(date) => setClearEndDate(format(date, "yyyy-MM-dd"))}
                                            selectsEnd
                                            startDate={parseDate1(clearStartDate)}
                                            endDate={parseDate1(clearEndDate)}
                                            minDate={parseDate1(clearStartDate)}
                                            dateFormat="yyyy-MM-dd"
                                            placeholderText="End Date"
                                            showMonthDropdown
                                            showYearDropdown
                                            dropdownMode="select"
                                            className="w-full p-2 border-2 border-black rounded-lg cursor-pointer text-sm sm:text-base"
                                        />
                                        <i 
                                            className="fa fa-calendar absolute right-3 top-3 text-gray-700 cursor-pointer hover:text-gray-900" 
                                            onClick={() => clearEndDatePickerRef.current?.input?.focus()}
                                        />
                                    </div>

                                    <button
                                        onClick={handleReset1}
                                        className="px-3 sm:px-4 py-1.5 sm:py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm sm:text-base whitespace-nowrap"
                                    >
                                        Reset
                                    </button>
                                </div>

                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 w-full">
                                    <button
                                        onClick={handleClearHistory}
                                        className="flex-1 px-3 sm:px-4 py-1.5 sm:py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm sm:text-base"
                                    >
                                        Clear History
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowClearHistorySection(false);
                                            setClearStartDate("");
                                            setClearEndDate("");    
                                        }}
                                        className="flex-1 px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-400 text-black rounded-lg hover:bg-gray-500 text-sm sm:text-base"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </section>
        </Layout>
    );
};

export default LockerHistory;
