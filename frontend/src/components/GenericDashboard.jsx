import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, CalendarCheck, FileText, Clock, CheckCircle, XCircle, AlertCircle, User, Menu, X, LogOut, Users, Trash2, UserCircle, Edit3 } from 'lucide-react';

export default function GenericDashboard() {
  const [profileFormData, setProfileFormData] = useState({
    dob: '',
    photo: null,
    fatherName: '',
    motherName: '',
    emergencyContactNumber: '',
    isFresher: true,
    documents: {
      aadhaar: null,
      pan: null,
      marksheets: null,
      offer_letter: null,
      joining_form: null,
      isa_form: null,
      affidavit: null,
      police_verification: null,
      passbook_copy: null,
    },
    previousCompanyDocuments: {
      experience_letter: null,
      payslips: null,
      relieving_letter: null,
    },
    additionalDocuments: [], // Array for additional documents with { name, file }
  });
  const [profileVerificationStatus, setProfileVerificationStatus] = useState('PENDING');
  const documentTypes = [
    'aadhaar',
    'pan',
    'marksheets',
    'offer_letter',
    'joining_form',
    'isa_form',
    'affidavit',
    'police_verification',
    'passbook_copy',
  ];
  const previousCompanyDocumentTypes = ['experience_letter', 'payslips', 'relieving_letter'];
  const [userData, setUserData] = useState(null);
  const [holidays, setHolidays] = useState([]);
  const [leaveBalance, setLeaveBalance] = useState({
    casualLeave: {total: 12, used: 0, remaining: 0},
    earnedLeave: {total: 20, used: 0, remaining: 0, usedFirstHalf: 0, usedSecondHalf: 0, carryover: 0},
    maternityLeave: {total: 182, used: 0, remaining: 182},
    paternityLeave: {total: 15, used: 0, remaining: 15},
    leaveWithoutPay: {total: 300, used: 0, remaining: 300},
  });
  const [leaveApplications, setLeaveApplications] = useState([]);
  const [subordinates, setSubordinates] = useState([]);
  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [cancellableLeaves, setCancellableLeaves] = useState([]);
  const [leaveFormData, setLeaveFormData] = useState({
    leaveType: 'CL',
    startDate: '',
    endDate: '',
    reason: '',
  });
  const [leaveDays, setLeaveDays] = useState(0);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState('dashboard');
  const navigate = useNavigate();

  const acceptedFileTypes = ".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png";

  const today = new Date().toISOString().split('T')[0];
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  const EL_FIRST_HALF = 10;
  const EL_SECOND_HALF = 10;

  // Consolidated useEffect for data fetching
  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          setError('Please log in to continue');
          navigate('/');
          return;
        }

        // Fetch user data
        const response = await fetch('http://localhost:8081/api/users/me', {
          headers: {Authorization: `Bearer ${token}`},
        });
        if (response.ok) {
          const data = await response.json();
          const joinDate = new Date(data.joinDate);
          const joinYear = joinDate.getFullYear();
          const joinMonth = joinDate.getMonth() + 1;
          const monthsAccrued = currentYear === joinYear
              ? Math.max(0, currentMonth - joinMonth + 1)
              : currentMonth;
          data.accruedCl = Math.min(12, monthsAccrued);
          data.reportingTo = data.reportingToName ? {fullName: data.reportingToName} : {fullName: null};
          setUserData(data);

          if (data.profileVerificationStatus) {
            const cleanStatus = data.profileVerificationStatus.trim();
            setProfileVerificationStatus(cleanStatus);

            if (['VERIFIED', 'EDIT_REQUESTED', 'EDIT_ALLOWED'].includes(cleanStatus)) {
              const allDocsFromServer = data.documents || [];
              const standardDocs = {};
              const prevCompanyDocs = {};
              const additionalDocs = [];

              allDocsFromServer.forEach(doc => {
                const docInfo = { name: doc.fileName };

                if (doc.isPreviousCompany) {
                  prevCompanyDocs[doc.documentType] = docInfo;
                } else if (doc.documentType === 'additional_document') {
                  additionalDocs.push({ name: doc.customDocumentName, file: docInfo });
                } else {
                  standardDocs[doc.documentType] = docInfo;
                }
              });

              setProfileFormData(prev => ({
                ...prev,
                dob: data.dob ? data.dob.split('T')[0] : '',
                fatherName: data.fatherName || '',
                motherName: data.motherName || '',
                emergencyContactNumber: data.emergencyContactNumber || '',
                isFresher: data.isFresher !== undefined ? data.isFresher : true,
                documents: standardDocs,
                previousCompanyDocuments: prevCompanyDocs,
                additionalDocuments: additionalDocs,
              }));
            }
          }
          // Fetch subordinates
          let subordinatesData = [];
          const subordinatesResponse = await fetch('http://localhost:8081/api/users/subordinates', {
            headers: {Authorization: `Bearer ${token}`},
          });
          if (subordinatesResponse.ok) {
            subordinatesData = await subordinatesResponse.json();
            setSubordinates(subordinatesData);
          } else {
            setSubordinates([]);
          }

          // Fetch pending leaves
          const pendingResponse = await fetch('http://localhost:8081/api/leaves/pending', {
            headers: {Authorization: `Bearer ${token}`},
          });
          if (pendingResponse.ok) {
            const pendingData = await pendingResponse.json();
            setPendingLeaves(pendingData);
          } else {
            setPendingLeaves([]);
          }

          // Fetch cancellable leaves
          if (subordinatesData.length > 0) {
            const cancellableResponse = await fetch('http://localhost:8081/api/leaves/cancellable', {
              headers: {Authorization: `Bearer ${token}`},
            });
            if (cancellableResponse.ok) {
              const cancellableData = await cancellableResponse.json();
              setCancellableLeaves(cancellableData);
            } else {
              setCancellableLeaves([]);
            }
          } else {
            setCancellableLeaves([]);
          }

          // Fetch holidays
          const holidaysResponse = await fetch('http://localhost:8081/api/holidays', {
            headers: {Authorization: `Bearer ${token}`},
          });
          if (holidaysResponse.ok) {
            const holidaysData = await holidaysResponse.json();
            setHolidays(holidaysData.map(h => h.date));
          } else {
            setHolidays([]);
          }
        } else if (response.status === 401) {
          setError('Session expired. Please log in again.');
          localStorage.removeItem('authToken');
          navigate('/');
        } else {
          setError('Failed to fetch user data.');
        }
      } catch (err) {
        setError('An error occurred. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    const fetchLeaveData = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('authToken');
        if (!token) return;

        const balanceResponse = await fetch('http://localhost:8081/api/leaves/balance', {
          headers: {Authorization: `Bearer ${token}`},
        });
        if (balanceResponse.ok) {
          const balanceData = await balanceResponse.json();
          const sanitizedBalance = {
            casualLeave: balanceData.casualLeave || {total: 12, used: 0, remaining: 0},
            earnedLeave: balanceData.earnedLeave || {
              total: 20, used: 0, remaining: 0, usedFirstHalf: 0, usedSecondHalf: 0, carryover: 0,
            },
            maternityLeave: balanceData.maternityLeave || {total: 182, used: 0, remaining: 182},
            paternityLeave: balanceData.paternityLeave || {total: 15, used: 0, remaining: 15},
            leaveWithoutPay: balanceData.leaveWithoutPay || {total: 300, used: 0, remaining: 300},
          };
          Object.keys(sanitizedBalance).forEach((key) => {
            sanitizedBalance[key].used = Number((sanitizedBalance[key].used || 0).toFixed(1));
            sanitizedBalance[key].remaining = Number((sanitizedBalance[key].remaining || 0).toFixed(1));
            if (key === 'earnedLeave') {
              sanitizedBalance[key].usedFirstHalf = Number((sanitizedBalance[key].usedFirstHalf || 0).toFixed(1));
              sanitizedBalance[key].usedSecondHalf = Number((sanitizedBalance[key].usedSecondHalf || 0).toFixed(1));
              sanitizedBalance[key].carryover = Number((sanitizedBalance[key].carryover || 0).toFixed(1));
            }
          });
          setLeaveBalance(sanitizedBalance);
        }

        const applicationsResponse = await fetch('http://localhost:8081/api/leaves', {
          headers: {Authorization: `Bearer ${token}`},
        });
        if (applicationsResponse.ok) {
          const applicationsData = await applicationsResponse.json();
          setLeaveApplications(applicationsData);
        }
      } catch (err) {
        setError('An error occurred while fetching leave data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
    fetchLeaveData();
  }, [navigate]);

  // --- Other useEffect hooks and handlers from your code...
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    if (leaveFormData.startDate && (leaveFormData.leaveType === 'ML' || leaveFormData.leaveType === 'PL')) {
      const calculatedEndDate = calculateEndDate(leaveFormData.startDate, leaveFormData.leaveType);
      setLeaveFormData((prev) => ({...prev, endDate: calculatedEndDate}));
    }
    if (leaveFormData.startDate) {
      const days = calculateLeaveDays(
          leaveFormData.startDate,
          leaveFormData.endDate,
          leaveFormData.leaveType
      );
      setLeaveDays(days);
    } else {
      setLeaveDays(0);
    }
  }, [leaveFormData.startDate, leaveFormData.endDate, leaveFormData.leaveType]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setUserData(null);
    navigate('/');
  };

  const isNonWorkingDay = (date) => {
    if (!date || isNaN(new Date(date).getTime())) return false;
    const formattedDate = new Date(date).toISOString().split('T')[0];
    return holidays.includes(formattedDate);
  };

  const calculateLeaveDays = (startDate, endDate, leaveType) => {
    // ... (This function remains unchanged)
    const start = new Date(startDate);
    if (isNaN(start.getTime())) return 0;

    if (leaveType === 'HALF_DAY_CL' || leaveType === 'HALF_DAY_EL' || leaveType === 'HALF_DAY_LWP') {
      if (isNonWorkingDay(startDate)) return 0;
      return 0.5;
    }

    if (leaveType === 'ML') return 182;
    if (leaveType === 'PL') return 15;
    if (!endDate) return 0;

    const end = new Date(endDate);
    if (isNaN(end.getTime())) return 0;

    if (leaveType === 'EL') {
      return Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    }

    let currentDate = new Date(start);
    let days = 0;
    while (currentDate <= end) {
      if (!isNonWorkingDay(currentDate)) {
        days += 1;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return days;
  };

  // --- All other handlers like handleLeaveSubmit, handleLeaveAction, etc. remain the same ---
  // ... (paste all your other functions here, from calculateEndDate up to, but not including, renderProfileView)
  const calculateEndDate = (startDate, leaveType) => {
    if (!startDate) return '';
    const start = new Date(startDate);
    if (isNaN(start.getTime())) return '';
    if (leaveType === 'ML') {
      start.setDate(start.getDate() + 181);
    } else if (leaveType === 'PL') {
      start.setDate(start.getDate() + 14);
    } else {
      return leaveFormData.endDate;
    }
    return start.toISOString().split('T')[0];
  };

  const hasOverlappingLeaves = (startDate, endDate, leaveType) => {
    const start = new Date(startDate);
    if (isNaN(start.getTime())) return false;
    const newStart = start;
    const newEnd = (leaveType === 'HALF_DAY_CL' || leaveType === 'HALF_DAY_EL' || leaveType === 'HALF_DAY_LWP')
        ? new Date(startDate)
        : new Date(endDate);
    if (isNaN(newEnd.getTime())) return false;

    return leaveApplications.some((application) => {
      if (application.status === 'REJECTED') return false;
      const existingStart = new Date(application.startDate);
      const existingEnd = (application.leaveType === 'HALF_DAY_CL' || application.leaveType === 'HALF_DAY_EL' || application.leaveType === 'HALF_DAY_LWP')
          ? new Date(application.startDate)
          : new Date(application.endDate);
      if (isNaN(existingStart.getTime()) || isNaN(existingEnd.getTime())) return false;
      return existingStart <= newEnd && existingEnd >= newStart;
    });
  };

  const calculateAvailableClForMonth = (applicationMonth, applicationYear) => {
    const joinDate = new Date(userData?.joinDate);
    const joinYear = joinDate.getFullYear();
    const joinMonth = joinDate.getMonth() + 1;
    let totalClAccrued = 0;

    if (applicationYear < joinYear || (applicationYear === joinYear && applicationMonth < joinMonth)) {
      return 0;
    }

    const endMonth = (joinYear === applicationYear) ? Math.min(applicationMonth, 12) : applicationMonth;
    const startMonth = (joinYear === applicationYear) ? joinMonth : 1;

    for (let month = startMonth; month <= endMonth; month++) {
      totalClAccrued += 1;
    }

    const totalUsedCl = leaveApplications
        .filter(app => (app.leaveType === 'CL' || app.leaveType === 'HALF_DAY_CL') &&
            (app.status === 'APPROVED' || app.status === 'PENDING') &&
            new Date(app.startDate).getFullYear() === applicationYear &&
            new Date(app.startDate).getMonth() + 1 <= applicationMonth)
        .reduce((total, app) => total + calculateLeaveDays(app.startDate, app.endDate, app.leaveType), 0);

    return Math.max(0, totalClAccrued - totalUsedCl);
  };

  const handleLeaveSubmit = async () => {
    setIsSubmitting(true);
    setError('');
    setSuccessMessage('');

    if (leaveFormData.startDate) {
      const selectedDate = new Date(leaveFormData.startDate);
      const todayDate = new Date(today);
      const earliestAllowedDate = new Date(todayDate.setDate(todayDate.getDate() - 6));
      if (leaveFormData.leaveType === 'CL' || leaveFormData.leaveType === 'HALF_DAY_CL') {
        if (selectedDate < earliestAllowedDate) {
          setError('Casual leave can only be applied for dates within the last 6 days, including today');
          setIsSubmitting(false);
          return;
        }
      } else {
        if (selectedDate < new Date(today)) {
          setError('Start date cannot be in the past for non-casual leave types');
          setIsSubmitting(false);
          return;
        }
      }
    }

    if (!leaveFormData.startDate || !leaveFormData.reason) {
      setError('Please fill all required fields');
      setIsSubmitting(false);
      return;
    }

    if (
        leaveFormData.leaveType !== 'HALF_DAY_CL' &&
        leaveFormData.leaveType !== 'HALF_DAY_EL' &&
        leaveFormData.leaveType !== 'HALF_DAY_LWP' &&
        leaveFormData.leaveType !== 'ML' &&
        leaveFormData.leaveType !== 'PL' &&
        !leaveFormData.endDate
    ) {
      setError('Please provide an end date');
      setIsSubmitting(false);
      return;
    }

    if (
        leaveFormData.endDate &&
        new Date(leaveFormData.endDate) < new Date(leaveFormData.startDate)
    ) {
      setError('End date cannot be earlier than start date');
      setIsSubmitting(false);
      return;
    }

    if (
        (leaveFormData.leaveType === 'HALF_DAY_CL' ||
            leaveFormData.leaveType === 'HALF_DAY_EL' ||
            leaveFormData.leaveType === 'HALF_DAY_LWP') &&
        isNonWorkingDay(leaveFormData.startDate)
    ) {
      setError('Half-day leave cannot be applied on a holiday');
      setIsSubmitting(false);
      return;
    }

    const leaveDays = calculateLeaveDays(
        leaveFormData.startDate,
        leaveFormData.endDate,
        leaveFormData.leaveType
    );
    if (leaveDays === 0) {
      setError('No working days selected for leave');
      setIsSubmitting(false);
      return;
    }

    const endDateForOverlap =
        leaveFormData.leaveType === 'HALF_DAY_CL' ||
        leaveFormData.leaveType === 'HALF_DAY_EL' ||
        leaveFormData.leaveType === 'HALF_DAY_LWP'
            ? leaveFormData.startDate
            : leaveFormData.endDate;
    if (hasOverlappingLeaves(leaveFormData.startDate, endDateForOverlap, leaveFormData.leaveType)) {
      setError(`You already have a leave application overlapping with the dates ${leaveFormData.startDate} to ${endDateForOverlap}.`);
      setIsSubmitting(false);
      return;
    }

    if (leaveFormData.leaveType === 'CL' || leaveFormData.leaveType === 'HALF_DAY_CL') {
      const startDate = new Date(leaveFormData.startDate);
      const applicationMonth = startDate.getMonth() + 1;
      const applicationYear = startDate.getFullYear();
      const joinDate = new Date(userData?.joinDate);
      const joinYear = joinDate.getFullYear();
      const joinMonth = joinDate.getMonth() + 1;

      if (applicationYear > currentYear || (applicationYear === currentYear && applicationMonth > currentMonth)) {
        setError('CL application is only allowed up to the current month');
        setIsSubmitting(false);
        return;
      }

      if (joinYear === currentYear && applicationMonth < joinMonth) {
        setError('Cannot apply CL for a month before your joining date');
        setIsSubmitting(false);
        return;
      }

      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`http://localhost:8081/api/leaves/available-cl/${applicationYear}/${applicationMonth}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const availableCl = await response.json();
          const availableClForMonth = availableCl.availableCl || 0;
          if (availableClForMonth < leaveDays) {
            setError(`Insufficient CL balance for ${startDate.toLocaleString('default', { month: 'long' })}: ${availableClForMonth.toFixed(1)}`);
            setIsSubmitting(false);
            return;
          }
        } else {
          setError('Failed to fetch available CL balance.');
          setIsSubmitting(false);
          return;
        }
      } catch (err) {
        setError('An error occurred while checking CL balance.');
        setIsSubmitting(false);
        return;
      }
    }

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Session expired. Please log in again.');
        localStorage.removeItem('authToken');
        navigate('/');
        setIsSubmitting(false);
        return;
      }

      const leaveTypeMap = {
        CL: 'casualLeave',
        EL: 'earnedLeave',
        ML: 'maternityLeave',
        PL: 'paternityLeave',
        HALF_DAY_CL: 'casualLeave',
        HALF_DAY_EL: 'earnedLeave',
        LWP: 'leaveWithoutPay',
        HALF_DAY_LWP: 'leaveWithoutPay',
      };

      if (!['EL', 'HALF_DAY_EL', 'CL', 'HALF_DAY_CL'].includes(leaveFormData.leaveType)) {
        const leaveKey = leaveTypeMap[leaveFormData.leaveType];
        const remainingLeaves = leaveBalance[leaveKey]?.remaining || 0;
        if (remainingLeaves < leaveDays) {
          setError(`Insufficient ${leaveKey.replace(/([A-Z])/g, ' $1').trim()} balance: ${remainingLeaves}`);
          setIsSubmitting(false);
          return;
        }
      }

      const endDate =
          leaveFormData.leaveType === 'HALF_DAY_CL' ||
          leaveFormData.leaveType === 'HALF_DAY_EL' ||
          leaveFormData.leaveType === 'HALF_DAY_LWP'
              ? leaveFormData.startDate
              : leaveFormData.endDate;

      const response = await fetch('http://localhost:8081/api/leaves', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          leaveType: leaveFormData.leaveType,
          startDate: leaveFormData.startDate,
          endDate,
          reason: leaveFormData.reason,
          isHalfDay: leaveFormData.leaveType === 'HALF_DAY_CL' ||
              leaveFormData.leaveType === 'HALF_DAY_EL' ||
              leaveFormData.leaveType === 'HALF_DAY_LWP',
        }),
      });

      if (response.ok) {
        setSuccessMessage(`Leave application submitted successfully! Awaiting approval from ${
            userData?.reportingTo?.fullName || 'your reporting manager'
        }.`);
        setLeaveFormData({
          leaveType: 'CL',
          startDate: '',
          endDate: '',
          reason: '',
        });
        setLeaveDays(0);
        setActiveView('leave-applications');

        // Re-fetch leave balance and applications to ensure latest data
        try {
          const balanceResponse = await fetch('http://localhost:8081/api/leaves/balance', {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (balanceResponse.ok) {
            const balanceData = await balanceResponse.json();
            const sanitizedBalance = {
              casualLeave: balanceData.casualLeave || { total: 12, used: 0, remaining: 0 },
              earnedLeave: balanceData.earnedLeave || {
                total: 20,
                used: 0,
                remaining: 0,
                usedFirstHalf: 0,
                usedSecondHalf: 0,
                carryover: 0,
              },
              maternityLeave: balanceData.maternityLeave || { total: 182, used: 0, remaining: 182 },
              paternityLeave: balanceData.paternityLeave || { total: 15, used: 0, remaining: 15 },
              leaveWithoutPay: balanceData.leaveWithoutPay || { total: 300, used: 0, remaining: 300 },
            };
            Object.keys(sanitizedBalance).forEach((key) => {
              sanitizedBalance[key].used = Number((sanitizedBalance[key].used || 0).toFixed(1));
              sanitizedBalance[key].remaining = Number((sanitizedBalance[key].remaining || 0).toFixed(1));
              if (key === 'earnedLeave') {
                sanitizedBalance[key].usedFirstHalf = Number((sanitizedBalance[key].usedFirstHalf || 0).toFixed(1));
                sanitizedBalance[key].usedSecondHalf = Number((sanitizedBalance[key].usedSecondHalf || 0).toFixed(1));
                sanitizedBalance[key].carryover = Number((sanitizedBalance[key].carryover || 0).toFixed(1));
              }
            });
            setLeaveBalance(sanitizedBalance);
          }

          const applicationsResponse = await fetch('http://localhost:8081/api/leaves', {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (applicationsResponse.ok) {
            const applicationsData = await applicationsResponse.json();
            setLeaveApplications(applicationsData);
          }
        } catch (err) {
          setError('An error occurred while refreshing leave data.');
        }
      } else {
        let errorMessage = 'Failed to submit leave application';
        if (response.status === 401) {
          setError('Session expired. Please log in again.');
          localStorage.removeItem('authToken');
          navigate('/');
        } else {
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
          } catch (jsonError) {
            errorMessage = `Server error: ${response.status} ${response.statusText}`;
          }
          setError(errorMessage);
        }
      }
    } catch (err) {
      setError('An error occurred while submitting the application');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLeaveAction = async (leaveId, action) => {
    setIsSubmitting(true);
    setError('');
    setSuccessMessage('');

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Session expired. Please log in again.');
        localStorage.removeItem('authToken');
        navigate('/');
        setIsSubmitting(false);
        return;
      }

      const response = await fetch(`http://localhost:8081/api/leaves/${leaveId}/${action}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setSuccessMessage(`Leave ${action}d successfully!`);
        const pendingResponse = await fetch('http://localhost:8081/api/leaves/pending', {
          headers: {Authorization: `Bearer ${token}`},
        });
        if (pendingResponse.ok) {
          const pendingData = await pendingResponse.json();
          setPendingLeaves(pendingData);
        }
        setActiveView('pending-leaves');
      } else {
        let errorMessage = `Failed to ${action} leave`;
        if (response.status === 401) {
          setError('Session expired. Please log in again.');
          localStorage.removeItem('authToken');
          navigate('/');
        } else {
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
          } catch (jsonError) {
            errorMessage = `Server error: ${response.status} ${response.statusText}`;
          }
          setError(errorMessage);
        }
      }
    } catch (err) {
      setError(`An error occurred while ${action}ing the leave`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="w-5 h-5 text-yellow-500"/>;
      case 'APPROVED':
        return <CheckCircle className="w-5 h-5 text-green-500"/>;
      case 'REJECTED':
        return <XCircle className="w-5 h-5 text-red-500"/>;
        // --- MODIFICATION START ---
      case 'EDIT_REQUESTED':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'EDIT_ALLOWED':
        return <Edit3 className="w-5 h-5 text-blue-500" />;
      case 'VERIFIED':
        return <CheckCircle className="w-5 h-5 text-green-500"/>;
        // --- MODIFICATION END ---
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500"/>;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'text-yellow-600 bg-yellow-50';
      case 'APPROVED':
        return 'text-green-600 bg-green-50';
      case 'REJECTED':
        return 'text-red-600 bg-red-50';
        // --- MODIFICATION START ---
      case 'VERIFIED':
        return 'text-green-600 bg-green-50';
      case 'SUBMITTED':
        return 'text-blue-600 bg-blue-50';
      case 'EDIT_REQUESTED':
        return 'text-yellow-600 bg-yellow-50';
      case 'EDIT_ALLOWED':
        return 'text-blue-600 bg-blue-50';
        // --- MODIFICATION END ---
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const leaveTypeMap = {
    CL: 'casualLeave',
    EL: 'earnedLeave',
    ML: 'maternityLeave',
    PL: 'paternityLeave',
    HALF_DAY_CL: 'casualLeave',
    HALF_DAY_EL: 'earnedLeave',
    LWP: 'leaveWithoutPay',
    HALF_DAY_LWP: 'leaveWithoutPay',
  };

  const isLeaveTypeAvailable = (leaveType) => {
    if (leaveType === 'EL' || leaveType === 'HALF_DAY_EL') {
      const totalEligible = EL_FIRST_HALF + EL_SECOND_HALF;
      const totalUsed = leaveBalance.earnedLeave.usedFirstHalf + leaveBalance.earnedLeave.usedSecondHalf;
      if (currentMonth <= 6) {
        return leaveBalance.earnedLeave.usedFirstHalf < EL_FIRST_HALF - leaveBalance.earnedLeave.usedSecondHalf ||
            totalUsed < totalEligible;
      }
      const secondHalfEligible = EL_SECOND_HALF + leaveBalance.earnedLeave.carryover;
      return leaveBalance.earnedLeave.usedSecondHalf < secondHalfEligible;
    }

    const leaveKey = leaveTypeMap[leaveType];
    return leaveBalance[leaveKey]?.remaining > 0;
  };

  const totalRemainingLeaves = Number(
      (leaveBalance.casualLeave.remaining + leaveBalance.earnedLeave.remaining).toFixed(1)
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';
    return date.toISOString().split('T')[0];
  };

  const leaveBalanceMetrics = [
    {
      key: 'total-leave-balance',
      title: 'Total Leave Balance (CL + EL)',
      value: totalRemainingLeaves,
      borderColor: 'border-purple-500',
      icon: <User size={24} className="text-purple-500"/>,
      details: [{label: 'Total Remaining', value: totalRemainingLeaves}],
    },
    {
      key: 'casual-leave',
      title: 'Casual Leave (CL)',
      borderColor: 'border-blue-500',
      icon: <CalendarCheck size={24} className="text-blue-500"/>,
      details: [
        {label: 'Total Annual', value: leaveBalance.casualLeave.total},
        {label: 'Accrued This Year', value: userData?.accruedCl || 0, textColor: 'text-blue-600'},
        {label: 'Used', value: leaveBalance.casualLeave.used.toFixed(1), textColor: 'text-red-600'},
        {
          label: 'Remaining',
          value: leaveBalance.casualLeave.remaining.toFixed(1),
          textColor: 'text-green-600'
        },
      ],
    },
    {
      key: 'earned-leave',
      title: 'Earned Leave (EL)',
      borderColor: 'border-green-500',
      icon: <Calendar size={24} className="text-green-500"/>,
      details: [
        {label: 'Total Annual', value: leaveBalance.earnedLeave.total},
        {
          label: 'Carryover',
          value: leaveBalance.earnedLeave.carryover.toFixed(1),
          textColor: 'text-blue-600'
        },
        {
          label: 'Used First Half',
          value: leaveBalance.earnedLeave.usedFirstHalf.toFixed(1),
          textColor: 'text-red-600'
        },
        {
          label: 'Used Second Half',
          value: leaveBalance.earnedLeave.usedSecondHalf.toFixed(1),
          textColor: 'text-red-600'
        },
        {
          label: 'Remaining',
          value: leaveBalance.earnedLeave.remaining.toFixed(1),
          textColor: 'text-green-600'
        },
      ],
      note: currentMonth <= 6 && leaveBalance.earnedLeave.usedSecondHalf > 0
          ? `Pending advance EL: ${leaveBalance.earnedLeave.usedSecondHalf.toFixed(1)} days. Total EL balance after approval: ${(leaveBalance.earnedLeave.total - leaveBalance.earnedLeave.usedFirstHalf - leaveBalance.earnedLeave.usedSecondHalf).toFixed(1)} days.`
          : null,
    },
    ...(userData?.gender?.toUpperCase() === 'FEMALE'
        ? [{
          key: 'maternity-leave',
          title: 'Maternity Leave (ML)',
          borderColor: 'border-pink-500',
          icon: <Calendar size={24} className="text-pink-500"/>,
          details: [
            {label: 'Total', value: leaveBalance.maternityLeave.total},
            {label: 'Used', value: leaveBalance.maternityLeave.used.toFixed(1), textColor: 'text-red-600'},
            {
              label: 'Remaining',
              value: leaveBalance.maternityLeave.remaining.toFixed(1),
              textColor: 'text-green-600'
            },
          ],
        }]
        : []),
    ...(userData?.gender?.toUpperCase() === 'MALE'
        ? [{
          key: 'paternity-leave',
          title: 'Paternity Leave (PL)',
          borderColor: 'border-blue-500',
          icon: <Calendar size={24} className="text-blue-500"/>,
          details: [
            {label: 'Total', value: leaveBalance.paternityLeave.total},
            {label: 'Used', value: leaveBalance.paternityLeave.used.toFixed(1), textColor: 'text-red-600'},
            {
              label: 'Remaining',
              value: leaveBalance.paternityLeave.remaining.toFixed(1),
              textColor: 'text-green-600'
            },
          ],
        }]
        : []),
    {
      key: 'leave-without-pay',
      title: 'Leave Without Pay (LWP)',
      borderColor: 'border-gray-500',
      icon: <Calendar size={24} className="text-gray-500"/>,
      details: [
        {label: 'Used', value: leaveBalance.leaveWithoutPay.used.toFixed(1), textColor: 'text-red-600'},
      ],
    },
  ];
  const renderDashboardView = () => {
    // This function remains unchanged
    if (isLoading) {
      return (
          <div className="flex justify-center items-center h-64">
            <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none"
                 viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                      strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
          </div>
      );
    }

    return (
        <div className="space-y-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Leave Balance Overview</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {leaveBalanceMetrics.map((metric) => (
                  <div
                      key={metric.key}
                      className={`bg-white rounded-lg p-5 border-l-4 ${metric.borderColor} shadow-md hover:shadow-lg transition-all duration-200`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-700">{metric.title}</h3>
                      {metric.icon}
                    </div>
                    <div className="space-y-3">
                      {metric.details.map((detail, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <span className="text-gray-600">{detail.label}</span>
                            <span
                                className={`font-bold text-xl ${detail.textColor || 'text-gray-900'}`}>
                                            {detail.value}
                                        </span>
                          </div>
                      ))}
                      {metric.note && (
                          <p className="text-sm text-gray-600 mt-2">{metric.note}</p>
                      )}
                    </div>
                  </div>
              ))}
            </div>
          </div>
        </div>
    );
  };
  const handleFileChange = (e, docType, isPreviousCompany = false, index = null) => {
    // This function remains unchanged
    const file = e.target.files[0];
    if (file) {
      if (isPreviousCompany) {
        setProfileFormData((prev) => ({
          ...prev,
          previousCompanyDocuments: {
            ...prev.previousCompanyDocuments,
            [docType]: file,
          },
        }));
      } else if (index !== null) {
        // Handle additional documents
        setProfileFormData((prev) => {
          const updatedAdditionalDocuments = [...prev.additionalDocuments];
          updatedAdditionalDocuments[index] = {
            ...updatedAdditionalDocuments[index],
            file,
          };
          return { ...prev, additionalDocuments: updatedAdditionalDocuments };
        });
      } else {
        setProfileFormData((prev) => ({
          ...prev,
          documents: {
            ...prev.documents,
            [docType]: file,
          },
        }));
      }
    }
  };
  const handleAdditionalDocNameChange = (index, name) => {
    // This function remains unchanged
    setProfileFormData((prev) => {
      const updatedAdditionalDocuments = [...prev.additionalDocuments];
      updatedAdditionalDocuments[index] = {
        ...updatedAdditionalDocuments[index],
        name,
      };
      return { ...prev, additionalDocuments: updatedAdditionalDocuments };
    });
  };
  const addAdditionalDocument = () => {
    // This function remains unchanged
    setProfileFormData((prev) => ({
      ...prev,
      additionalDocuments: [...prev.additionalDocuments, { name: '', file: null }],
    }));
  };
  const removeAdditionalDocument = (indexToRemove) => {
    // This function remains unchanged
    setProfileFormData((prev) => ({
      ...prev,
      additionalDocuments: prev.additionalDocuments.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleProfileSubmit = async () => {
    // This function remains unchanged
    setIsSubmitting(true);
    setError('');
    setSuccessMessage('');

    // Validate required fields
    if (
        !profileFormData.dob ||
        !profileFormData.fatherName ||
        !profileFormData.motherName ||
        !profileFormData.emergencyContactNumber ||
        !profileFormData.photo
    ) {
      setError('Please fill all required fields and upload a photo.');
      setIsSubmitting(false);
      return;
    }

    // Validate document uploads
    for (const docType of documentTypes) {
      if (!profileFormData.documents[docType]) {
        setError(`Please upload ${docType.replace(/_/g, ' ')}.`);
        setIsSubmitting(false);
        return;
      }
    }

    if (!profileFormData.isFresher) {
      for (const docType of previousCompanyDocumentTypes) {
        if (!profileFormData.previousCompanyDocuments[docType]) {
          setError(`Please upload ${docType.replace(/_/g, ' ')} for previous company.`);
          setIsSubmitting(false);
          return;
        }
      }
    }

    // Validate additional documents
    for (const [index, doc] of profileFormData.additionalDocuments.entries()) {
      if (!doc.name || !doc.file) {
        setError(`Please provide both name and file for additional document ${index + 1}.`);
        setIsSubmitting(false);
        return;
      }
    }

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Session expired. Please log in again.');
        localStorage.removeItem('authToken');
        navigate('/');
        setIsSubmitting(false);
        return;
      }

      // Prepare FormData for API call
      const formData = new FormData();
      formData.append('dob', profileFormData.dob);
      formData.append('fatherName', profileFormData.fatherName);
      formData.append('motherName', profileFormData.motherName);
      formData.append('emergencyContactNumber', profileFormData.emergencyContactNumber);
      formData.append('isFresher', profileFormData.isFresher);
      formData.append('photo', profileFormData.photo);
      documentTypes.forEach((docType) => {
        if (profileFormData.documents[docType]) {
          formData.append(docType, profileFormData.documents[docType]);
        }
      });
      if (!profileFormData.isFresher) {
        previousCompanyDocumentTypes.forEach((docType) => {
          if (profileFormData.previousCompanyDocuments[docType]) {
            formData.append(docType, profileFormData.previousCompanyDocuments[docType]);
          }
        });
      }
      profileFormData.additionalDocuments.forEach((doc, index) => {
        if (doc.file && doc.name) {
          formData.append(`additionalDocument_${index}_name`, doc.name);
          formData.append(`additionalDocument_${index}_file`, doc.file);
        }
      });

      const response = await fetch('http://localhost:8081/api/users/profile', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        setSuccessMessage('Profile submitted successfully for HR verification!');
        setProfileVerificationStatus('SUBMITTED');
      } else {
        let errorMessage = 'Failed to submit profile';
        if (response.status === 401) {
          setError('Session expired. Please log in again.');
          localStorage.removeItem('authToken');
          navigate('/');
        } else {
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
          } catch (jsonError) {
            errorMessage = `Server error: ${response.status} ${response.statusText}`;
          }
          setError(errorMessage);
        }
      }
    } catch (err) {
      setError('An error occurred while submitting the profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- MODIFICATION START: New handler function for edit request ---
  const handleEditRequest = async () => {
    setIsSubmitting(true);
    setError('');
    setSuccessMessage('');

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Session expired. Please log in again.');
        navigate('/');
        return;
      }

      const response = await fetch('http://localhost:8081/api/users/request-edit', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setSuccessMessage('Your request to edit the profile has been sent to HR for approval.');
        setProfileVerificationStatus('EDIT_REQUESTED'); // Update UI immediately
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to send edit request.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  // --- MODIFICATION END ---


  // --- MODIFICATION START: Fully updated renderProfileView ---
  const renderProfileView = () => {
    if (isLoading) {
      return (
          <div className="flex justify-center items-center h-64">
            <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
          </div>
      );
    }

    if (!userData) {
      return (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <p className="text-sm text-red-700">Unable to load profile data. Please try again later.</p>
          </div>
      );
    }

    // Determine if the form should be disabled based on the status
    const isFormDisabled = ['SUBMITTED', 'VERIFIED', 'EDIT_REQUESTED'].includes(profileVerificationStatus);
    const statusText = profileVerificationStatus.replace(/_/g, ' ');

    return (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900">Profile Details</h2>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="mb-4">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(profileVerificationStatus)}`}>
                {getStatusIcon(profileVerificationStatus)}
                <span className="ml-1">{statusText}</span>
              </span>
            </div>

            {profileVerificationStatus === 'EDIT_REQUESTED' && (
                <div className="text-center py-6 bg-blue-50 border border-blue-200 rounded-lg mb-6">
                  <p className="text-blue-700 text-lg font-medium">Edit Request Pending</p>
                  <p className="text-gray-600 mt-1">Your request to edit the profile is awaiting approval from HR.</p>
                </div>
            )}

            {profileVerificationStatus === 'EDIT_ALLOWED' && (
                <div className="text-center py-6 bg-green-50 border border-green-200 rounded-lg mb-6">
                  <p className="text-green-700 text-lg font-medium">Profile Unlocked for Editing</p>
                  <p className="text-gray-600 mt-1">Your request has been approved. Please make your changes and re-submit for verification.</p>
                </div>
            )}

            {/* Read-Only view for VERIFIED and EDIT_REQUESTED */}
            {(profileVerificationStatus === 'VERIFIED' || profileVerificationStatus === 'EDIT_REQUESTED') ? (
                <div className="space-y-6">
                  <div className="flex items-center mb-6">
                    <UserCircle size={48} className="text-blue-500 mr-4"/>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-700">{userData.fullName || 'N/A'}</h3>
                      <p className="text-sm text-gray-500">{userData.role || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div><p className="text-sm font-medium text-gray-600">Employee ID</p><p className="text-lg font-semibold text-gray-900">{userData.employeeId || 'N/A'}</p></div>
                    <div><p className="text-sm font-medium text-gray-600">Email</p><p className="text-lg font-semibold text-gray-900">{userData.email || 'N/A'}</p></div>
                    <div><p className="text-sm font-medium text-gray-600">Department</p><p className="text-lg font-semibold text-gray-900">{userData.department || 'N/A'}</p></div>
                    <div><p className="text-sm font-medium text-gray-600">Reporting To</p><p className="text-lg font-semibold text-gray-900">{userData.reportingTo?.fullName || 'Not Assigned'}</p></div>
                    <div><p className="text-sm font-medium text-gray-600">Joining Date</p><p className="text-lg font-semibold text-gray-900">{formatDate(userData.joinDate)}</p></div>
                    <div><p className="text-sm font-medium text-gray-600">Gender</p><p className="text-lg font-semibold text-gray-900">{userData.gender || 'N/A'}</p></div>
                    <div><p className="text-sm font-medium text-gray-600">Date of Birth</p><p className="text-lg font-semibold text-gray-900">{profileFormData.dob || 'N/A'}</p></div>
                    <div><p className="text-sm font-medium text-gray-600">Father's Name</p><p className="text-lg font-semibold text-gray-900">{profileFormData.fatherName || 'N/A'}</p></div>
                    <div><p className="text-sm font-medium text-gray-600">Mother's Name</p><p className="text-lg font-semibold text-gray-900">{profileFormData.motherName || 'N/A'}</p></div>
                    <div><p className="text-sm font-medium text-gray-600">Emergency Contact Number</p><p className="text-lg font-semibold text-gray-900">{profileFormData.emergencyContactNumber || 'N/A'}</p></div>
                    <div><p className="text-sm font-medium text-gray-600">Fresher Status</p><p className="text-lg font-semibold text-gray-900">{profileFormData.isFresher ? 'Fresher' : 'Experienced'}</p></div>
                  </div>

                  {profileVerificationStatus === 'VERIFIED' && (
                      <div className="text-center pt-6 mt-6 border-t">
                        <p className="text-gray-600 mb-4">Need to update your information? Request HR to unlock your profile.</p>
                        <button
                            onClick={handleEditRequest}
                            disabled={isSubmitting}
                            className={`inline-flex items-center justify-center py-2.5 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                                isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-orange-600 hover:bg-orange-700'
                            } focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors duration-200`}
                        >
                          {isSubmitting ? 'Submitting...' : <><Edit3 size={16} className="mr-2"/> Request Profile Edit</>}
                        </button>
                      </div>
                  )}
                </div>
            ) : (
                // EDITABLE FORM VIEW for PENDING, EDIT_ALLOWED, SUBMITTED
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                      <input type="date" value={profileFormData.dob} onChange={(e) => setProfileFormData({ ...profileFormData, dob: e.target.value })} className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" disabled={isFormDisabled} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Passport Size Photo</label>
                      <input type="file" accept="image/*" onChange={(e) => setProfileFormData({ ...profileFormData, photo: e.target.files[0] })} className="w-full p-2 border border-gray-300 rounded-md" disabled={isFormDisabled} />
                      {profileFormData.photo && <p className="text-sm text-green-600 mt-1">File selected: {profileFormData.photo.name}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Father's Name</label>
                      <input type="text" value={profileFormData.fatherName} onChange={(e) => setProfileFormData({ ...profileFormData, fatherName: e.target.value })} className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" disabled={isFormDisabled} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Mother's Name</label>
                      <input type="text" value={profileFormData.motherName} onChange={(e) => setProfileFormData({ ...profileFormData, motherName: e.target.value })} className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" disabled={isFormDisabled} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact Number</label>
                      <input type="tel" value={profileFormData.emergencyContactNumber} onChange={(e) => setProfileFormData({ ...profileFormData, emergencyContactNumber: e.target.value })} className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" disabled={isFormDisabled} placeholder="Enter emergency contact number" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Are you a Fresher?</label>
                      <select value={profileFormData.isFresher} onChange={(e) => setProfileFormData({ ...profileFormData, isFresher: e.target.value === 'true' })} className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" disabled={isFormDisabled}>
                        <option value={true}>Yes, I am a Fresher</option>
                        <option value={false}>No, I have previous work experience</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Upload Documents</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {documentTypes.map((docType) => (
                          <div key={docType}>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{docType.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</label>
                            <input type="file" accept={acceptedFileTypes} onChange={(e) => handleFileChange(e, docType)} className="w-full p-2 border border-gray-300 rounded-md" disabled={isFormDisabled}/>
                            {profileFormData.documents[docType] && (<p className="text-sm text-green-600 mt-1">File selected: {profileFormData.documents[docType].name}</p>)}
                          </div>
                      ))}
                    </div>
                  </div>

                  {!profileFormData.isFresher && (
                      <div className="mt-6">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">Previous Company Documents</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          {previousCompanyDocumentTypes.map((docType) => (
                              <div key={docType}>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{docType.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</label>
                                <input type="file" accept={acceptedFileTypes} onChange={(e) => handleFileChange(e, docType, true)} className="w-full p-2 border border-gray-300 rounded-md" disabled={isFormDisabled} />
                                {profileFormData.previousCompanyDocuments[docType] && (<p className="text-sm text-green-600 mt-1">File selected: {profileFormData.previousCompanyDocuments[docType].name}</p>)}
                              </div>
                          ))}
                        </div>
                      </div>
                  )}

                  <div className="mt-6">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-lg font-semibold text-gray-700">Additional Documents</h3>
                      {!isFormDisabled && (
                          <button onClick={addAdditionalDocument} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm font-medium">Add Document</button>
                      )}
                    </div>
                    {profileFormData.additionalDocuments.map((doc, index) => (
                        <div key={index} className="p-4 border rounded-md mt-4 bg-gray-50">
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Document Name</label>
                              <input type="text" value={doc.name || ''} onChange={(e) => handleAdditionalDocNameChange(index, e.target.value)} className="w-full p-2 border border-gray-300 rounded-md" disabled={isFormDisabled} placeholder="Enter document name"/>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Upload Document</label>
                              <input type="file" accept={acceptedFileTypes} onChange={(e) => handleFileChange(e, null, false, index)} className="w-full p-2 border border-gray-300 rounded-md" disabled={isFormDisabled}/>
                              {doc.file && (<p className="text-sm text-green-600 mt-1">File selected: {doc.file.name}</p>)}
                            </div>
                          </div>
                          {!isFormDisabled && (
                              <div className="text-right mt-3">
                                <button onClick={() => removeAdditionalDocument(index)} className="inline-flex items-center px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200"><Trash2 size={16} className="mr-1.5" />Remove</button>
                              </div>
                          )}
                        </div>
                    ))}
                  </div>

                  {!isFormDisabled && (
                      <button
                          onClick={handleProfileSubmit}
                          disabled={isSubmitting}
                          className={`w-full flex justify-center items-center py-2.5 px-4 mt-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-700 hover:bg-blue-800'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200`}
                      >
                        {isSubmitting ? (
                            <span className="flex items-center"><svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg>Submitting...</span>
                        ) : 'Submit Profile for Verification'}
                      </button>
                  )}
                </div>
            )}
          </div>
        </div>
    );
  };
  // --- MODIFICATION END ---

  // --- Paste the rest of your functions here ---
  // renderApplyLeaveView, renderLeaveApplicationsView, etc.
  // ... all of them remain unchanged ...
  const renderApplyLeaveView = () => {
    const isHalfDay = leaveFormData.leaveType === 'HALF_DAY_CL' || leaveFormData.leaveType === 'HALF_DAY_EL' || leaveFormData.leaveType === 'HALF_DAY_LWP';
    const isFixedDuration = leaveFormData.leaveType === 'ML' || leaveFormData.leaveType === 'PL';
    const minDate = (leaveFormData.leaveType === 'CL' || leaveFormData.leaveType === 'HALF_DAY_CL')
        ? new Date(new Date().setDate(new Date().getDate() - 6)).toISOString().split('T')[0]
        : today;

    return (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900">Apply for Leave</h2>
          <div className="bg-white rounded-lg shadow-lg p-6">
            {currentMonth <= 6 && leaveBalance.earnedLeave.usedSecondHalf > 0 && (leaveFormData.leaveType === 'EL' || leaveFormData.leaveType === 'HALF_DAY_EL') && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-yellow-800 font-medium">
                    Pending advance EL: {leaveBalance.earnedLeave.usedSecondHalf.toFixed(1)} days.
                  </p>
                </div>
            )}
            {(leaveFormData.leaveType === 'CL' || leaveFormData.leaveType === 'HALF_DAY_CL') && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-blue-800 font-medium">
                    Accrued CL: {(userData?.accruedCl || 0).toFixed(1)} days.
                  </p>
                </div>
            )}
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type</label>
                  <select
                      value={leaveFormData.leaveType}
                      onChange={(e) => setLeaveFormData({
                        ...leaveFormData,
                        leaveType: e.target.value,
                        endDate: ''
                      })}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      autoComplete="off"
                  >
                    <option value="CL" disabled={!isLeaveTypeAvailable('CL')}>
                      Casual Leave {isLeaveTypeAvailable('CL') ? '' : '(Unavailable)'}
                    </option>
                    <option value="EL" disabled={!isLeaveTypeAvailable('EL')}>
                      Earned Leave
                    </option>
                    <option value="HALF_DAY_CL" disabled={!isLeaveTypeAvailable('HALF_DAY_CL')}>
                      Half-Day CL
                    </option>
                    <option value="HALF_DAY_EL" disabled={!isLeaveTypeAvailable('HALF_DAY_EL')}>
                      Half-Day EL
                    </option>
                    {userData?.gender?.toUpperCase() === 'FEMALE' && (
                        <option value="ML" disabled={!isLeaveTypeAvailable('ML')}>
                          Maternity Leave
                        </option>
                    )}
                    {userData?.gender?.toUpperCase() === 'MALE' && (
                        <option value="PL" disabled={!isLeaveTypeAvailable('PL')}>
                          Paternity Leave
                        </option>
                    )}
                    <option value="LWP" disabled={!isLeaveTypeAvailable('LWP')}>
                      Leave Without Pay
                    </option>
                    <option value="HALF_DAY_LWP" disabled={!isLeaveTypeAvailable('HALF_DAY_LWP')}>
                      Half-Day LWP
                    </option>
                  </select>
                  {leaveBalance[leaveTypeMap[leaveFormData.leaveType]]?.remaining <= 0 && !['EL', 'HALF_DAY_EL', 'CL', 'HALF_DAY_CL'].includes(leaveFormData.leaveType) && (
                      <div className="text-red-600 text-sm mt-1">
                        No remaining {leaveFormData.leaveType.replace(/_/g, ' ').toLowerCase()} available.
                      </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar size={18} className="text-gray-400"/>
                    </div>
                    <input
                        type="date"
                        value={leaveFormData.startDate}
                        onChange={(e) => {
                          const startDate = e.target.value;
                          setLeaveFormData({...leaveFormData, startDate});
                          if (isNonWorkingDay(startDate) && (leaveFormData.leaveType === 'HALF_DAY_CL' || leaveFormData.leaveType === 'HALF_DAY_EL' || leaveFormData.leaveType === 'HALF_DAY_LWP')) {
                            setError('Half-day leave cannot be applied on a non-working day');
                          } else {
                            setError('');
                          }
                        }}
                        min={minDate}
                        className={`pl-10 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${leaveFormData.startDate && leaveFormData.startDate < minDate ? 'border-red-500 bg-red-50' : ''}`}
                        autoComplete="off"
                    />
                  </div>
                  {leaveFormData.startDate && leaveFormData.startDate < minDate && (
                      <div className="text-red-600 text-sm mt-1">
                        Date is outside the allowed range.
                      </div>
                  )}
                </div>
                {!isHalfDay && !isFixedDuration && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Calendar size={18} className="text-gray-400"/>
                        </div>
                        <input
                            type="date"
                            value={leaveFormData.endDate}
                            onChange={(e) => setLeaveFormData({
                              ...leaveFormData,
                              endDate: e.target.value
                            })}
                            min={leaveFormData.startDate || today}
                            className={`pl-10 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${leaveFormData.endDate && leaveFormData.startDate && leaveFormData.endDate < leaveFormData.startDate ? 'border-red-500 bg-red-50' : ''}`}
                            autoComplete="off"
                        />
                      </div>
                      {leaveFormData.endDate && leaveFormData.startDate && leaveFormData.endDate < leaveFormData.startDate && (
                          <div className="text-red-600 text-sm mt-1">
                            End date cannot be before start date.
                          </div>
                      )}
                    </div>
                )}
                {isFixedDuration && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Calendar size={18} className="text-gray-400"/>
                        </div>
                        <input
                            type="date"
                            value={leaveFormData.endDate}
                            readOnly
                            className="pl-10 w-full p-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                            autoComplete="off"
                        />
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {leaveFormData.leaveType === 'ML' ? 'Maternity leave: 182 days.' : 'Paternity leave: 15 days.'}
                      </p>
                    </div>
                )}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                  <textarea
                      value={leaveFormData.reason}
                      onChange={(e) => setLeaveFormData({...leaveFormData, reason: e.target.value})}
                      rows="3"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      autoComplete="off"
                      placeholder="Provide a reason for your leave"
                  ></textarea>
                </div>
              </div>
              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  Total leave days: <span className="font-bold">{leaveDays.toFixed(1)}</span>
                </p>
              </div>
              <button
                  onClick={handleLeaveSubmit}
                  disabled={
                      isSubmitting ||
                      !leaveFormData.startDate ||
                      !leaveFormData.reason ||
                      ((leaveFormData.leaveType !== 'HALF_DAY_CL' &&
                              leaveFormData.leaveType !== 'HALF_DAY_EL' &&
                              leaveFormData.leaveType !== 'HALF_DAY_LWP' &&
                              leaveFormData.leaveType !== 'ML' &&
                              leaveFormData.leaveType !== 'PL') &&
                          !leaveFormData.endDate) ||
                      (leaveFormData.startDate && leaveFormData.startDate < minDate) ||
                      (leaveFormData.endDate && leaveFormData.startDate && leaveFormData.endDate < leaveFormData.startDate && leaveFormData.leaveType !== 'ML' && leaveFormData.leaveType !== 'PL') ||
                      leaveDays === 0
                  }
                  className={`w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                      isSubmitting ||
                      !leaveFormData.startDate ||
                      !leaveFormData.reason ||
                      leaveDays === 0
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-blue-700 hover:bg-blue-800'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200`}
              >
                {isSubmitting ? (
                    <span className="flex items-center">
                                <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                                </svg>
                                Submitting...
                            </span>
                ) : (
                    'Submit Application'
                )}
              </button>
            </div>
          </div>
        </div>
    );
  };

  const renderLeaveApplicationsView = () => {
    if (isLoading) {
      return (
          <div className="flex justify-center items-center h-64">
            <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none"
                 viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                      strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
          </div>
      );
    }

    return (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900">My Leave Applications</h2>
          <div className="bg-white rounded-lg shadow-lg p-6">
            {leaveApplications.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Type</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Start Date</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">End Date</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Applied On</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Reason</th>
                    </tr>
                    </thead>
                    <tbody>
                    {leaveApplications.map((application) => (
                        <tr key={application.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">{application.leaveType || 'N/A'}</td>
                          <td className="py-3 px-4">{formatDate(application.startDate)}</td>
                          <td className="py-3 px-4">
                            {(application.leaveType === 'HALF_DAY_CL' ||
                                application.leaveType === 'HALF_DAY_EL' ||
                                application.leaveType === 'HALF_DAY_LWP')
                                ? `${formatDate(application.startDate)} (Half-Day)`
                                : application.endDate ? formatDate(application.endDate) : 'N/A'}
                          </td>
                          <td className="py-3 px-4">
                                            <span
                                                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                                                {getStatusIcon(application.status)}
                                              <span className="ml-1">{application.status || 'Unknown'}</span>
                                            </span>
                          </td>
                          <td className="py-3 px-4">{formatDate(application.appliedOn)}</td>
                          <td className="py-3 px-4">{application.reason || 'N/A'}</td>
                        </tr>
                    ))}
                    </tbody>
                  </table>
                </div>
            ) : (
                <div className="text-center py-6">
                  <p className="text-gray-600">No leave applications found.</p>
                </div>
            )}
          </div>
        </div>
    );
  };

  const renderSubordinatesView = () => {
    if (subordinates.length === 0) return null;
    if (isLoading) {
      return (
          <div className="flex justify-center items-center h-64">
            <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none"
                 viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                      strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
          </div>
      );
    }

    return (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900">Subordinates</h2>
          <div className="bg-white rounded-lg shadow-lg p-6">
            {subordinates.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Name</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Role</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Email</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Employee Id</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Department</th>
                    </tr>
                    </thead>
                    <tbody>
                    {subordinates.map((subordinate) => (
                        <tr key={subordinate.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">{subordinate.fullName || 'N/A'}</td>
                          <td className="py-3 px-4">{subordinate.role || 'N/A'}</td>
                          <td className="py-3 px-4">{subordinate.email || 'N/A'}</td>
                          <td className="py-3 px-4">{subordinate.employeeId || 'N/A'}</td>
                          <td className="py-3 px-4">{subordinate.department || 'N/A'}</td>
                        </tr>
                    ))}
                    </tbody>
                  </table>
                </div>
            ) : (
                <div className="text-center py-6">
                  <p className="text-gray-600">No subordinates found.</p>
                </div>
            )}
          </div>
        </div>
    );
  };

  const renderPendingLeavesView = () => {
    if (subordinates.length === 0) return null;
    if (isLoading) {
      return (
          <div className="flex justify-center items-center h-64">
            <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none"
                 viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                      strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
          </div>
      );
    }

    return (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900">Pending Leave Approvals</h2>
          <div className="bg-white rounded-lg shadow-lg p-6">
            {pendingLeaves.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Employee</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Type</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Start Date</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">End Date</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Reason</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {pendingLeaves.map((leave) => (
                        <tr key={leave.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">{leave.userName || 'N/A'}</td>
                          <td className="py-3 px-4">{leave.leaveType || 'N/A'}</td>
                          <td className="py-3 px-4">{formatDate(leave.startDate)}</td>
                          <td className="py-3 px-4">
                            {(leave.leaveType === 'HALF_DAY_CL' ||
                                leave.leaveType === 'HALF_DAY_EL' ||
                                leave.leaveType === 'HALF_DAY_LWP')
                                ? `${formatDate(leave.startDate)} (Half-Day)`
                                : leave.endDate ? formatDate(leave.endDate) : 'N/A'}
                          </td>
                          <td className="py-3 px-4">{leave.reason || 'N/A'}</td>
                          <td className="py-3 px-4">
                            <div className="flex space-x-2">
                              <button
                                  onClick={() => handleLeaveAction(leave.id, 'approve')}
                                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                                  disabled={isSubmitting}
                              >
                                Approve
                              </button>
                              <button
                                  onClick={() => handleLeaveAction(leave.id, 'reject')}
                                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                  disabled={isSubmitting}
                              >
                                Reject
                              </button>
                            </div>
                          </td>
                        </tr>
                    ))}
                    </tbody>
                  </table>
                </div>
            ) : (
                <div className="text-center py-6">
                  <p className="text-gray-600">No pending leave requests.</p>
                </div>
            )}
          </div>
        </div>
    );
  };

  const renderCancellableLeavesView = () => {
    if (subordinates.length === 0) return null;
    if (isLoading) {
      return (
          <div className="flex justify-center items-center h-64">
            <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none"
                 viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                      strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
          </div>
      );
    }

    return (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900">Cancellable Leaves</h2>
          <div className="bg-white rounded-lg shadow-lg p-6">
            {cancellableLeaves.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Employee</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Role</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Email</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">ID</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Department</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Leave Date(s)</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Type</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {cancellableLeaves.map((leave) => {
                      const subordinate = subordinates.find(s => s.fullName === leave.userName) || {};
                      return (
                          <tr key={leave.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">{leave.userName || "N/A"}</td>
                            <td className="py-3 px-4">{subordinate.role || "N/A"}</td>
                            <td className="py-3 px-4">{subordinate.email || "N/A"}</td>
                            <td className="py-3 px-4">{subordinate.employeeId || "N/A"}</td>
                            <td className="py-3 px-4">{leave.department || "N/A"}</td>
                            <td className="py-3 px-4">
                              {leave.isHalfDay
                                  ? `${formatDate(leave.startDate)} (Half-Day)`
                                  : `${formatDate(leave.startDate)} - ${formatDate(leave.endDate)}`}
                            </td>
                            <td className="py-3 px-4">{leave.leaveType || "N/A"}</td>
                            <td className="py-3 px-4">
                              <button
                                  onClick={() => handleCancelLeave(leave.id)}
                                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                  disabled={isSubmitting}
                              >
                                Cancel
                              </button>
                            </td>
                          </tr>
                      );
                    })}
                    </tbody>
                  </table>
                </div>
            ) : (
                <div className="text-center py-6">
                  <p className="text-gray-600">No cancellable leaves found.</p>
                </div>
            )}
          </div>
        </div>
    );
  };

  const handleCancelLeave = async (leaveId) => {
    setIsSubmitting(true);
    setError('');
    setSuccessMessage('');

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Session expired. Please log in again.');
        localStorage.removeItem('authToken');
        navigate('/');
        setIsSubmitting(false);
        return;
      }

      const response = await fetch(`http://localhost:8081/api/leaves/${leaveId}/cancel`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setSuccessMessage('Leave cancelled successfully!');
        const cancellableResponse = await fetch('http://localhost:8081/api/leaves/cancellable', {
          headers: {Authorization: `Bearer ${token}`},
        });
        if (cancellableResponse.ok) {
          const cancellableData = await cancellableResponse.json();
          setCancellableLeaves(cancellableData);
        }
      } else {
        let errorMessage = 'Failed to cancel leave';
        if (response.status === 401) {
          setError('Session expired. Please log in again.');
          localStorage.removeItem('authToken');
          navigate('/');
        } else {
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
          } catch (jsonError) {
            errorMessage = `Server error: ${response.status} ${response.statusText}`;
          }
          setError(errorMessage);
        }
      }
    } catch (err) {
      setError('An error occurred while cancelling the leave');
    } finally {
      setIsSubmitting(false);
    }
  };


  const renderMainContent = () => {
    if (error && (error.includes('Session expired') || error.includes('Failed to fetch user data'))) {
      return (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <p className="text-sm text-red-700">{error}</p>
          </div>
      );
    }

    switch (activeView) {
      case 'dashboard':
        return renderDashboardView();
      case 'profile':
        return renderProfileView();
      case 'apply-leave':
        return renderApplyLeaveView();
      case 'leave-applications':
        return renderLeaveApplicationsView();
      case 'subordinates':
        return renderSubordinatesView();
      case 'pending-leaves':
        return renderPendingLeavesView();
      case 'cancel-leaves':
        return renderCancellableLeavesView();
      default:
        return renderDashboardView();
    }
  };

  return (
      <div className="min-h-screen bg-gray-50 flex font-sans">
        <div
            className={`fixed inset-y-0 left-0 z-30 w-64 bg-blue-900 text-white transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out shadow-lg`}
        >
          <div className="flex items-center justify-between p-4 border-b border-blue-800">
            <div className="flex items-center space-x-3">
              <img src="/Images/bisag_logo.png" alt="BISAG-N Logo" className="h-10 w-10 rounded-full"/>
              <span className="text-xl font-semibold">BISAG-N HRMS</span>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden">
              <X size="24"/>
            </button>
          </div>
          <nav className="p-4 space-y-2">
            <button
                onClick={() => setActiveView('dashboard')}
                className={`flex items-center w-full p-3 text-left rounded-lg transition duration-200 ${activeView === 'dashboard' ? 'bg-blue-800' : 'hover:bg-blue-800'}`}
            >
              <User size={20} className="mr-3"/>
              Dashboard
            </button>
            <button
                onClick={() => setActiveView('profile')}
                className={`flex items-center w-full p-3 text-left rounded-lg transition duration-200 ${activeView === 'profile' ? 'bg-blue-800' : 'hover:bg-blue-800'}`}
            >
              <UserCircle size={20} className="mr-3"/>
              Profile
            </button>
            <button
                onClick={() => setActiveView('apply-leave')}
                className={`flex items-center w-full p-3 text-left rounded-lg transition duration-200 ${activeView === 'apply-leave' ? 'bg-blue-800' : 'hover:bg-blue-800'}`}
            >
              <FileText size={20} className="mr-3"/>
              Apply for Leave
            </button>
            <button
                onClick={() => setActiveView('leave-applications')}
                className={`flex items-center w-full p-3 text-left rounded-lg transition duration-200 ${activeView === 'leave-applications' ? 'bg-blue-800' : 'hover:bg-blue-800'}`}
            >
              <CalendarCheck size={20} className="mr-3"/>
              Leave Applications
            </button>
            {subordinates.length > 0 && (
                <>
                  <button
                      onClick={() => setActiveView('subordinates')}
                      className={`flex items-center w-full p-3 text-left rounded-lg transition duration-200 ${activeView === 'subordinates' ? 'bg-blue-800' : 'hover:bg-blue-800'}`}
                  >
                    <Users size={20} className="mr-3"/>
                    Subordinates
                  </button>
                  <button
                      onClick={() => setActiveView('pending-leaves')}
                      className={`flex items-center w-full p-3 text-left rounded-lg transition duration-200 ${activeView === 'pending-leaves' ? 'bg-blue-800' : 'hover:bg-blue-800'}`}
                  >
                    <Clock size={20} className="mr-3"/>
                    Pending Leaves
                  </button>
                  <button
                      onClick={() => {
                        setActiveView('cancel-leaves');
                        setIsSidebarOpen(false);
                      }}
                      className={`flex items-center w-full p-3 text-left rounded-lg transition duration-200 ${activeView === 'cancel-leaves' ? 'bg-blue-800' : 'hover:bg-blue-800'}`}
                  >
                    <Trash2 size={20} className="mr-3"/>
                    Cancel Leaves
                  </button>
                </>
            )}
            <button
                onClick={handleLogout}
                className="flex items-center w-full p-3 text-left rounded-lg hover:bg-red-600 transition duration-200"
            >
              <LogOut size={20} className="mr-3"/>
              Logout
            </button>
          </nav>
        </div>

        <div className="flex-1 flex flex-col lg:ml-64">
          <header className="bg-white shadow-lg p-4 flex items-center justify-between">
            <div className="flex items-center">
              <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden mr-4">
                <Menu size={24} className="text-gray-700"/>
              </button>
              <h1 className="text-2xl font-semibold text-gray-900">BISAG-N Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex flex-col">
                <span className="text-gray-700 font-medium">Welcome, {userData?.fullName || 'User'}</span>
                {userData?.reportingTo?.fullName ? (
                    <span className="text-gray-500 text-sm">
                                Reporting to: {userData.reportingTo.fullName}
                            </span>
                ) : (
                    <span className="text-gray-500 text-sm">Reporting to: Not assigned</span>
                )}
              </div>
              <img src="/Images/bisag_logo.png" alt="BISAG-N Logo" className="h-8 w-8 rounded-full"/>
            </div>
          </header>

          <main className="flex-1 p-8">
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 shadow-sm">
                  <p className="text-sm text-red-800 font-medium">{error}</p>
                </div>
            )}
            {successMessage && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8 shadow-sm">
                  <p className="text-sm text-green-800 font-medium">{successMessage}</p>
                </div>
            )}
            <div className="space-y-8">{renderMainContent()}</div>
          </main>

          <footer className="bg-blue-900 text-white py-4 text-center">
            <p className="text-sm">© 2025 BISAG-N. All rights reserved.</p>
          </footer>
        </div>
      </div>
  );
}