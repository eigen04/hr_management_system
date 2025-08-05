import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Clock, CheckCircle, AlertCircle, Building, Menu, X, LogOut, Download, ChevronLeft, ChevronRight, FileText, UserPlus, Calendar, UserCheck, Bell } from 'lucide-react';
import ExcelJS from 'exceljs';

export default function HRDashboard() {
  const navigate = useNavigate();
  const [updateRequests, setUpdateRequests] = useState([]);
  const [userData, setUserData] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [overallData, setOverallData] = useState({
    totalEmployees: 0,
    onLeaveToday: 0,
    approvedLeaves: 0,
    pendingLeaves: 0,
  });
  const [departmentData, setDepartmentData] = useState([]);
  const [employeesInDepartment, setEmployeesInDepartment] = useState([]);
  const [pendingSignups, setPendingSignups] = useState([]);
  const [disapproveModal, setDisapproveModal] = useState({ open: false, userId: null, reason: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState('dashboard');
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);
  const [newRole, setNewRole] = useState('');
  const [newDept, setNewDept] = useState('');
  const [roles, setRoles] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [isHolidayModalOpen, setIsHolidayModalOpen] = useState(false);
  const [newHoliday, setNewHoliday] = useState({ name: '', date: '', type: 'CUSTOM' });
  const [profileVerificationList, setProfileVerificationList] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [rejectionModal, setRejectionModal] = useState({ open: false, userId: null, reason: '' });
  const [isReportingModalOpen, setIsReportingModalOpen] = useState(false);
  const [allEmployeesList, setAllEmployeesList] = useState([]);
  const [selectedEmployeeForReportingChange, setSelectedEmployeeForReportingChange] = useState(null);
  const [newReportingToId, setNewReportingToId] = useState('');

  // ===================================================================================
  // ALL DATA FETCHING FUNCTIONS MOVED HERE & WRAPPED IN useCallback
  // ===================================================================================

  const fetchUpdateRequests = useCallback(async (token) => {
    try {
      const response = await fetch('http://localhost:8081/api/hr/edit-requests', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) setUpdateRequests(await response.json());
    } catch (error) {
      console.error('An error occurred while fetching update requests.');
    }
  }, []);

  const fetchPendingSignups = useCallback(async (token) => {
    try {
      const response = await fetch('http://localhost:8081/api/hr/pending-signups', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) setPendingSignups(await response.json());
    } catch (error) {
      console.error('Failed to load pending signup requests.');
    }
  }, []);

  const fetchProfilesForVerification = useCallback(async (token) => {
    try {
      const response = await fetch('http://localhost:8081/api/hr/profiles/verification', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) setProfileVerificationList(await response.json());
    } catch (error) {
      console.error('An error occurred while fetching profiles.');
    }
  }, []);

  const fetchDepartmentData = useCallback(async (token) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('http://localhost:8081/api/hr/departments', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      const formattedData = data
          .filter(dept => dept.id !== undefined && dept.id !== null)
          .map(dept => ({
            id: dept.id, name: dept.name || 'Unnamed Department', description: dept.description || '',
            employeeCount: dept.employeeCount || 0, onLeaveCount: dept.onLeaveCount || 0,
          }));
      setDepartmentData(formattedData);
    } catch (error) {
      setError('Failed to load department data.'); setDepartmentData([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchDashboardData = useCallback(async (token) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('http://localhost:8081/api/hr/dashboard-metrics', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      setOverallData({
        totalEmployees: data.totalEmployees || 0, onLeaveToday: data.onLeaveToday || 0,
        approvedLeaves: data.approvedLeaves || 0, pendingLeaves: data.pendingLeaves || 0,
      });
    } catch (error) {
      setError('Failed to load dashboard metrics.');
      setOverallData({ totalEmployees: 0, onLeaveToday: 0, approvedLeaves: 0, pendingLeaves: 0 });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchRoles = useCallback(async (token) => {
    try {
      const response = await fetch('http://localhost:8081/api/roles', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) setRoles(await response.json());
      else setError('Failed to fetch roles');
    } catch (error) {
      setError('Failed to fetch roles.');
    }
  }, []);

  const fetchHolidays = useCallback(async (token) => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:8081/api/hr/holidays', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) setHolidays(await response.json());
      else setError('Failed to fetch holidays');
    } catch (error) {
      setError('Failed to fetch holidays.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchAllEmployees = useCallback(async (token) => {
    try {
      const response = await fetch('http://localhost:8081/api/users/all', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) setAllEmployeesList(await response.json());
      else console.error('Failed to fetch all employees list.');
    } catch (error) {
      console.error('Error fetching all employees:', error);
    }
  }, []);

  // ===================================================================================
  // UseEffect for initial data load and view changes
  // ===================================================================================
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const role = localStorage.getItem('role');

    if (!token || role !== 'HR') {
      setError('Access denied. Please log in as HR.');
      navigate('/');
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost:8081/api/users/me', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          if (data.role !== 'HR') {
            setError('Access denied. This dashboard is for HR only.');
            navigate('/');
            return;
          }
          setUserData({
            fullName: data.fullName || 'HR Manager',
            department: data.department || 'Human Resources',
          });
        } else if (response.status === 401) {
          setError('Session expired. Please log in again.');
          localStorage.removeItem('authToken');
          localStorage.removeItem('role');
          navigate('/');
        } else {
          setError('Failed to fetch user data.');
        }
      } catch (error) {
        setError('Failed to fetch user data.');
      }
    };

    fetchUserData();
    fetchAllEmployees(token); // Fetch all employees for dropdowns initially

    switch (activeView) {
      case 'dashboard':
        fetchDashboardData(token);
        fetchRoles(token);
        fetchDepartmentData(token);
        break;
      case 'department-overview':
        fetchDepartmentData(token);
        break;
      case 'holidays':
        fetchHolidays(token);
        break;
      case 'pending-signups':
        fetchPendingSignups(token);
        break;
      case 'profile-verification':
        fetchProfilesForVerification(token);
        break;
      case 'update-requests':
        fetchUpdateRequests(token);
        break;
      default:
        break;
    }
  }, [navigate, activeView, fetchDashboardData, fetchRoles, fetchDepartmentData, fetchHolidays, fetchPendingSignups, fetchProfilesForVerification, fetchUpdateRequests, fetchAllEmployees]);

  // ===================================================================================
  // UseEffect for notification polling - THIS WILL NOW WORK
  // ===================================================================================
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    const fetchNotificationCounts = async () => {
      console.log("Polling for new notifications...", new Date().toLocaleTimeString());
      try {
        await Promise.all([
          fetchPendingSignups(token),
          fetchProfilesForVerification(token),
          fetchUpdateRequests(token)
        ]);
      } catch (error) {
        console.error("Failed to poll for notifications:", error);
      }
    };

    fetchNotificationCounts();
    const intervalId = setInterval(fetchNotificationCounts, 15000);
    return () => clearInterval(intervalId);

  }, [fetchPendingSignups, fetchProfilesForVerification, fetchUpdateRequests]);

  // ===================================================================================
  // All other component logic and JSX remains the same
  // ===================================================================================

  useEffect(() => {
    if (notification.message) {
      const timer = setTimeout(() => setNotification({ message: '', type: '' }), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const openReportingModal = (employee) => {
    setSelectedEmployeeForReportingChange(employee);
    setNewReportingToId(employee.reportingToId || '');
    setIsReportingModalOpen(true);
  };

  const closeReportingModal = () => {
    setIsReportingModalOpen(false);
    setSelectedEmployeeForReportingChange(null);
    setNewReportingToId('');
  };

  const handleReportingPersonChange = async (e) => {
    e.preventDefault();
    if (!selectedEmployeeForReportingChange || !newReportingToId) {
      setNotification({ message: 'Please select an employee and a new reporting person.', type: 'error' });
      return;
    }

    const token = localStorage.getItem('authToken');
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:8081/api/hr/change-reporting-person/${selectedEmployeeForReportingChange.id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newReportingToId }),
      });

      if (response.ok) {
        setNotification({ message: 'Reporting person updated successfully.', type: 'success' });
        if (selectedDepartment) {
          fetchEmployeesInDepartment(selectedDepartment);
        }
        closeReportingModal();
      } else {
        const data = await response.json();
        setNotification({ message: `Failed to update: ${data.message || 'Unknown error'}`, type: 'error' });
      }
    } catch (error) {
      setNotification({ message: 'An error occurred while updating the reporting person.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  // ... (Paste the rest of your component's functions and JSX here, starting from `isNonHoliday`)
  // No changes are needed for the functions below this point.
  const isNonHoliday = (dateStr) => {
    if (!dateStr || typeof dateStr !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      return false;
    }
    return !holidays.some(holiday => holiday.date === dateStr);
  };

  const handleApproveSignup = async (userId) => {
    const token = localStorage.getItem('authToken');
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:8081/api/hr/approve-signup/${userId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setPendingSignups(prev => prev.filter(user => user.id !== userId));
        setNotification({ message: 'User approved and added to the system successfully.', type: 'success' });
      } else {
        const data = await response.json().catch(() => ({}));
        setNotification({ message: `Failed to approve user: ${data.message || 'Unknown error'}`, type: 'error' });
      }
    } catch (error) {
      setNotification({ message: 'Failed to approve user.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisapproveSignup = async () => {
    const token = localStorage.getItem('authToken');
    const { userId, reason } = disapproveModal;
    if (!reason.trim()) {
      setNotification({ message: 'Please provide a reason for disapproval.', type: 'error' });
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:8081/api/hr/disapprove-signup/${userId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason }),
      });

      if (response.ok) {
        setPendingSignups(prev => prev.filter(user => user.id !== userId));
        setDisapproveModal({ open: false, userId: null, reason: '' });
        setNotification({ message: 'Signup request rejected and removed successfully.', type: 'success' });
      } else {
        const data = await response.json().catch(() => ({}));
        setNotification({ message: `Failed to disapprove user: ${data.message || 'Unknown error'}`, type: 'error' });
      }
    } catch (error) {
      setNotification({ message: 'Failed to reject signup request.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };
  const handleAddRole = async (e) => {
    e.preventDefault();
    if (!newRole.trim()) {
      setNotification({ message: 'Role name is required', type: 'error' });
      return;
    }
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setNotification({ message: 'Session expired. Please log in again.', type: 'error' });
        navigate('/');
        return;
      }
      const response = await fetch('http://localhost:8081/api/roles', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newRole.trim() }),
      });
      if (response.ok) {
        const addedRole = await response.json();
        setRoles([...roles, { id: addedRole.id, name: addedRole.name }]);
        setNewRole('');
        setIsRoleModalOpen(false);
        setNotification({ message: 'Role added successfully', type: 'success' });
      } else {
        const errorData = await response.json().catch(() => ({}));
        setNotification({ message: `Failed to add role: ${errorData.message || 'Unknown error'}`, type: 'error' });
      }
    } catch (error) {
      setNotification({ message: 'Failed to add role.', type: 'error' });
    }
  };

  const handleAddDept = async (e) => {
    e.preventDefault();
    if (!newDept.trim()) {
      setNotification({ message: 'Department name is required', type: 'error' });
      return;
    }
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setNotification({ message: 'Session expired. Please log in again.', type: 'error' });
        navigate('/');
        return;
      }
      const response = await fetch('http://localhost:8081/api/departments', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newDept.trim() }),
      });
      if (response.ok) {
        const addedDept = await response.json();
        setDepartmentData([
          ...departmentData,
          {
            id: addedDept.id,
            name: addedDept.name,
            description: addedDept.description || '',
            employeeCount: addedDept.employeeCount || 0,
            onLeaveCount: addedDept.onLeaveCount || 0,
          },
        ]);
        setNewDept('');
        setIsDeptModalOpen(false);
        setNotification({ message: 'Department added successfully', type: 'success' });
      } else {
        const errorData = await response.json().catch(() => ({}));
        setNotification({ message: `Failed to add department: ${errorData.message || 'Unknown error'}`, type: 'error' });
      }
    } catch (error) {
      setNotification({ message: 'Failed to add department.', type: 'error' });
    }
  };

  const handleAddHoliday = async (e) => {
    e.preventDefault();
    if (!newHoliday.name.trim() || !newHoliday.date) {
      setNotification({ message: 'Holiday name and date are required', type: 'error' });
      return;
    }
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:8081/api/hr/holidays', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newHoliday.name.trim(),
          date: newHoliday.date,
          type: newHoliday.type,
        }),
      });
      if (response.ok) {
        const addedHoliday = await response.json();
        setHolidays([...holidays, addedHoliday]);
        setNewHoliday({ name: '', date: '', type: 'CUSTOM' });
        setIsHolidayModalOpen(false);
        setNotification({ message: 'Holiday added successfully', type: 'success' });
      } else {
        const errorData = await response.json().catch(() => ({}));
        setNotification({ message: `Failed to add holiday: ${errorData.message || 'Unknown error'}`, type: 'error' });
      }
    } catch (error) {
      setNotification({ message: 'Failed to add holiday.', type: 'error' });
    }
  };

  const handleDeleteHoliday = async (holidayId) => {
    const token = localStorage.getItem('authToken');
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:8081/api/hr/holidays/${holidayId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        setHolidays(holidays.filter(h => h.id !== holidayId));
        setNotification({ message: 'Holiday deleted successfully', type: 'success' });
      } else {
        const errorData = await response.json().catch(() => ({}));
        setNotification({ message: `Failed to delete holiday: ${errorData.message || 'Unknown error'}`, type: 'error' });
      }
    } catch (error) {
      setNotification({ message: 'Failed to delete holiday.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEmployeesInDepartment = async (deptId) => {
    const token = localStorage.getItem('authToken');
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`http://localhost:8081/api/hr/departments/${deptId}/employees`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorData.message || 'Unknown error'}`);
      }

      const data = await response.json();
      const formattedEmployees = data.map(employee => {
        const getDatesInRange = (startDate, endDate) => {
          const dates = [];
          let currentDate = new Date(startDate);
          const end = new Date(endDate);
          if (isNaN(currentDate.getTime()) || isNaN(end.getTime())) {
            return dates;
          }
          while (currentDate <= end) {
            const formattedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
            dates.push(formattedDate);
            currentDate.setDate(currentDate.getDate() + 1);
          }
          return dates;
        };

        const mapLeaves = (applications, leaveType) => {
          if (!applications || !Array.isArray(applications)) {
            return [];
          }
          const typeMapping = {
            'CL': 'CL',
            'CASUAL': 'CL',
            'EL': 'EL',
            'EARNED': 'EL',
            'LWP': 'LWP',
            'PL': 'PATERNITY',
            'ML': 'MATERNITY',
            'HALF_DAY_CL': 'HALF_DAY_CL',
            'HALF_DAY_EL': 'HALF_DAY_EL',
            'HALF_DAY_LWP': 'HALF_DAY_LWP',
          };
          const filteredApps = applications.filter(app => {
            const appLeaveType = app.leaveType ? app.leaveType.toUpperCase() : '';
            const normalizedLeaveType = typeMapping[appLeaveType] || appLeaveType;
            return normalizedLeaveType === leaveType && app.status === 'APPROVED';
          });

          const uniqueDates = new Set();
          filteredApps.forEach(app => {
            const dates = getDatesInRange(app.startDate, app.endDate);
            dates.forEach(date => {
              if (['CL', 'LWP', 'HALF_DAY_CL', 'HALF_DAY_LWP'].includes(leaveType)) {
                if (isNonHoliday(date)) {
                  uniqueDates.add(date);
                }
              } else {
                uniqueDates.add(date);
              }
            });
          });

          return Array.from(uniqueDates).map(date => ({
            date,
            isHalfDay: leaveType.includes('HALF_DAY'),
            leaveType: leaveType,
          }));
        };

        return {
          id: employee.id,
          name: employee.fullName || 'Unnamed Employee',
          position: employee.role || 'Employee',
          leaves: {
            cl: mapLeaves(employee.leaveApplications, 'CL'),
            el: mapLeaves(employee.leaveApplications, 'EL'),
            lwp: mapLeaves(employee.leaveApplications, 'LWP'),
            maternity: mapLeaves(employee.leaveApplications, 'MATERNITY'),
            paternity: mapLeaves(employee.leaveApplications, 'PATERNITY'),
            half_day_cl: mapLeaves(employee.leaveApplications, 'HALF_DAY_CL'),
            half_day_el: mapLeaves(employee.leaveApplications, 'HALF_DAY_EL'),
            half_day_lwp: mapLeaves(employee.leaveApplications, 'HALF_DAY_LWP'),
          },
        };
      });

      setEmployeesInDepartment(formattedEmployees);
    } catch (error) {
      setError(`Failed to load employee data: ${error.message}`);
      setEmployeesInDepartment([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportExcel = async (deptId) => {
    const dept = departmentData.find(d => d.id === deptId);
    if (!dept || !employeesInDepartment.length) {
      setNotification({ message: 'No data available to export.', type: 'error' });
      return;
    }

    try {
      const year = currentMonth.getFullYear();
      const month = String(currentMonth.getMonth() + 1).padStart(2, '0');
      const monthRegex = new RegExp(`^${year}-${month}`);

      const reportData = employeesInDepartment.map(employee => {
        const countLeaves = (leaves, leaveType, isHalfDayType = false) => {
          if (!Array.isArray(leaves)) return 0;
          const filteredLeaves = leaves.filter(leave => {
            if (!leave || !leave.date || !leave.leaveType) return false;
            const isInMonth = monthRegex.test(leave.date);
            const shouldCheckHoliday = ['CL', 'HALF_DAY_CL', 'LWP', 'HALF_DAY_LWP'].includes(leaveType);
            const isValidDay = shouldCheckHoliday ? isNonHoliday(leave.date) : true;
            return isInMonth && isValidDay;
          });
          return filteredLeaves.reduce((total, leave) => {
            return total + (leave.isHalfDay || isHalfDayType ? 0.5 : 1);
          }, 0);
        };

        const clCount = countLeaves(employee.leaves.cl, 'CL', false);
        const elCount = countLeaves(employee.leaves.el, 'EL', false);
        const lwpCount = countLeaves(employee.leaves.lwp, 'LWP', false);
        const maternityCount = countLeaves(employee.leaves.maternity, 'MATERNITY', false);
        const paternityCount = countLeaves(employee.leaves.paternity, 'PATERNITY', false);
        const halfDayClCount = countLeaves(employee.leaves.half_day_cl, 'HALF_DAY_CL', true);
        const halfDayElCount = countLeaves(employee.leaves.half_day_el, 'HALF_DAY_EL', true);
        const halfDayLwpCount = countLeaves(employee.leaves.half_day_lwp, 'HALF_DAY_LWP', true);

        const totalLeaves = clCount + elCount + lwpCount + maternityCount + paternityCount + halfDayClCount + halfDayElCount + halfDayLwpCount;

        return {
          'Employee Name': employee.name,
          'Casual Leave': clCount,
          'Earned Leave': elCount,
          'Leave Without Pay': lwpCount,
          'Maternity Leave': maternityCount,
          'Paternity Leave': paternityCount,
          'Half Day Casual Leave': halfDayClCount,
          'Half Day Earned Leave': halfDayElCount,
          'Half Day Leave Without Pay': halfDayLwpCount,
          'Total Leaves': totalLeaves,
        };
      });

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Leave Report');
      const headers = Object.keys(reportData[0]);
      worksheet.columns = headers.map(header => ({
        header,
        key: header,
        width: header === 'Employee Name' ? 20 : 15,
      }));
      reportData.forEach(data => worksheet.addRow(data));
      const monthName = currentMonth.toLocaleString('default', { month: 'long' });
      const fileName = `${dept.name}_Leave_Report_${monthName}_${year}.xlsx`;
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(link.href);
      setNotification({ message: 'Leave report exported successfully', type: 'success' });
    } catch (error) {
      setNotification({ message: 'Failed to export leave report.', type: 'error' });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('role');
    localStorage.removeItem('userName');
    localStorage.removeItem('department');
    navigate('/');
  };

  const handleDepartmentClick = (deptId) => {
    if (!deptId) {
      setError('Invalid department selected.');
      return;
    }
    setSelectedDepartment(deptId);
    setSelectedEmployee(null);
    setActiveView(null);
    fetchEmployeesInDepartment(deptId);
  };

  const handleEmployeeClick = (employee) => {
    setSelectedEmployee(employee);
  };

  const handleMonthChange = (increment) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + increment);
    setCurrentMonth(newMonth);
  };
  const handleViewProfile = async (userId) => {
    const token = localStorage.getItem('authToken');
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:8081/api/hr/profiles/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setSelectedProfile(data);
      } else {
        setNotification({ message: 'Failed to fetch profile details.', type: 'error' });
      }
    } catch (error) {
      setNotification({ message: 'An error occurred while fetching profile details.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveProfile = async (userId) => {
    const token = localStorage.getItem('authToken');
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:8081/api/hr/profiles/${userId}/approve`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        setNotification({ message: 'Profile approved successfully!', type: 'success' });

        setProfileVerificationList(prevList =>
            prevList.map(profile =>
                profile.userId === userId
                    ? { ...profile, profileVerificationStatus: 'VERIFIED' }
                    : profile
            )
        );

        setSelectedProfile(null);

      } else {
        const data = await response.json();
        setNotification({ message: `Approval failed: ${data.message || 'Unknown error'}`, type: 'error' });
      }
    } catch (error) {
      setNotification({ message: 'An error occurred during approval.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRejectProfile = (userId) => {
    setRejectionModal({ open: true, userId: userId, reason: '' });
  };

  const submitProfileRejection = async () => {
    const { userId, reason } = rejectionModal;
    if (!reason.trim()) {
      setNotification({ message: 'Please provide a reason for rejection.', type: 'error' });
      return;
    }

    const token = localStorage.getItem('authToken');
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:8081/api/hr/profiles/${userId}/reject`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason }),
      });

      if (response.ok) {
        setNotification({ message: 'Profile rejected successfully. The user has been notified.', type: 'success' });
        setProfileVerificationList(prevList =>
            prevList.map(profile =>
                profile.userId === userId
                    ? { ...profile, profileVerificationStatus: 'PENDING' }
                    : profile
            )
        );
        setSelectedProfile(null);
        setRejectionModal({ open: false, userId: null, reason: '' });
      } else {
        const data = await response.json();
        setNotification({ message: `Rejection failed: ${data.message || 'Unknown error'}`, type: 'error' });
      }
    } catch (error) {
      setNotification({ message: 'An error occurred during rejection.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const backToOverview = () => {
    setSelectedDepartment(null);
    setSelectedEmployee(null);
    setEmployeesInDepartment([]);
    setActiveView('dashboard');
  };
  const backToDepartment = () => {
    setSelectedEmployee(null);
  };

  const generateCalendarDays = () => {
    if (!selectedEmployee) return [];

    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const calendarDays = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      calendarDays.push({ day: null, leaveType: null, isHalfDay: false, isHoliday: false });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      let leaveType = null;
      let isHalfDay = false;
      const isHoliday = holidays.some(holiday => holiday.date === date);

      const clLeave = selectedEmployee.leaves.cl?.find(leave => leave.date === date);
      const elLeave = selectedEmployee.leaves.el?.find(leave => leave.date === date);
      const lwpLeave = selectedEmployee.leaves.lwp?.find(leave => leave.date === date);
      const maternityLeave = selectedEmployee.leaves.maternity?.find(leave => leave.date === date);
      const paternityLeave = selectedEmployee.leaves.paternity?.find(leave => leave.date === date);
      const halfDayClLeave = selectedEmployee.leaves.half_day_cl?.find(leave => leave.date === date);
      const halfDayElLeave = selectedEmployee.leaves.half_day_el?.find(leave => leave.date === date);
      const halfDayLwpLeave = selectedEmployee.leaves.half_day_lwp?.find(leave => leave.date === date);

      if (halfDayClLeave) {
        leaveType = 'half_day_cl';
        isHalfDay = halfDayClLeave.isHalfDay;
      } else if (halfDayElLeave) {
        leaveType = 'half_day_el';
        isHalfDay = halfDayElLeave.isHalfDay;
      } else if (halfDayLwpLeave) {
        leaveType = 'half_day_lwp';
        isHalfDay = halfDayLwpLeave.isHalfDay;
      } else if (clLeave) {
        leaveType = 'cl';
        isHalfDay = clLeave.isHalfDay;
      } else if (elLeave) {
        leaveType = 'el';
        isHalfDay = elLeave.isHalfDay;
      } else if (lwpLeave) {
        leaveType = 'lwp';
        isHalfDay = lwpLeave.isHalfDay;
      } else if (maternityLeave) {
        leaveType = 'maternity';
        isHalfDay = maternityLeave.isHalfDay;
      } else if (paternityLeave) {
        leaveType = 'paternity';
        isHalfDay = paternityLeave.isHalfDay;
      }

      calendarDays.push({ day, leaveType, isHalfDay, isHoliday });
    }

    return calendarDays;
  };
  const renderProfileDetailView = () => {
    if (!selectedProfile) return null;

    const { userDetails, documents } = selectedProfile;

    return (
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <button
                onClick={() => setSelectedProfile(null)}
                className="p-2 rounded-full hover:bg-gray-100 transition duration-200"
                aria-label="Back to list"
            >
              <ChevronLeft size={20} className="text-gray-700" />
            </button>
            <h2 className="text-2xl font-semibold text-gray-900">{selectedProfile.fullName}'s Profile</h2>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div><span className="font-medium text-gray-600">Full Name:</span> {selectedProfile.fullName}</div>
              <div><span className="font-medium text-gray-600">Employee ID:</span> {selectedProfile.employeeId}</div>
              <div><span className="font-medium text-gray-600">Email:</span> {selectedProfile.email}</div>
              <div><span className="font-medium text-gray-600">Date of Birth:</span> {selectedProfile.dob}</div>
              <div><span className="font-medium text-gray-600">Father's Name:</span> {selectedProfile.fatherName}</div>
              <div><span className="font-medium text-gray-600">Mother's Name:</span> {selectedProfile.motherName}</div>
              <div><span className="font-medium text-gray-600">Emergency Contact:</span> {selectedProfile.emergencyContactNumber}</div>
              <div><span className="font-medium text-gray-600">Is Fresher?:</span> {selectedProfile.isFresher ? 'Yes' : 'No'}</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Uploaded Documents</h3>
            <ul className="space-y-2">
              {selectedProfile.documents.map((doc, index) => (
                  <li key={index} className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 border border-transparent hover:border-gray-200">
                    <div className="flex items-center space-x-3">
                      <FileText size={18} className="text-gray-500" />
                      <span className="text-sm font-medium text-gray-800 capitalize">
                      {doc.customDocumentName || doc.documentType.replace(/_/g, ' ')}
                    </span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <button
                          onClick={() => handleViewDocument(doc.fileName)}
                          className="text-sm font-medium text-blue-600 hover:underline focus:outline-none"
                          title="View Document"
                      >
                        View
                      </button>
                      <button
                          onClick={() => handleDownloadDocument(doc.fileName)}
                          className="p-2 rounded-full text-gray-600 hover:bg-blue-100 hover:text-blue-700 transition-colors duration-200 focus:outline-none"
                          title={`Download ${doc.customDocumentName || doc.documentType}`}
                          aria-label="Download document"
                      >
                        <Download size={18} />
                      </button>
                    </div>
                  </li>
              ))}
            </ul>
          </div>

          {selectedProfile.profileVerificationStatus === 'SUBMITTED' && (
              <div className="flex justify-end space-x-4">
                <button
                    onClick={() => handleRejectProfile(selectedProfile.userId)}
                    className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition duration-200"
                >
                  Reject
                </button>
                <button
                    onClick={() => handleApproveProfile(selectedProfile.userId)}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition duration-200"
                >
                  Approve
                </button>
              </div>
          )}
        </div>
    );
  };

  const renderProfileVerificationList = () => {
    return (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900">Profile Verification Requests</h2>
          {profileVerificationList.length === 0 && !isLoading ? (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-700">No profiles are currently pending verification.</p>
              </div>
          ) : (
              <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Employee ID</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Employee Name</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {profileVerificationList.map(profile => (
                        <tr key={profile.userId} className="hover:bg-gray-50 transition duration-150">
                          <td className="px-6 py-4 whitespace-nowrap text-gray-900">{profile.employeeId}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-900">{profile.fullName}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                profile.profileVerificationStatus === 'VERIFIED' ? 'bg-green-100 text-green-800' :
                                                    profile.profileVerificationStatus === 'SUBMITTED' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-red-100 text-red-800'
                                            }`}>
                                                {profile.profileVerificationStatus}
                                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                                onClick={() => handleViewProfile(profile.userId)}
                                className="text-blue-600 hover:text-blue-800 font-medium transition duration-200"
                            >
                              View Form
                            </button>
                          </td>
                        </tr>
                    ))}
                    </tbody>
                  </table>
                </div>
              </div>
          )}
        </div>
    );
  };
  const handleAllowUpdate = async (userId) => {
    if (!window.confirm('Are you sure you want to allow this user to update their profile? They will be notified by email.')) {
      return;
    }
    const token = localStorage.getItem('authToken');
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:8081/api/hr/profiles/${userId}/allow-edit`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        setNotification({ message: 'User has been notified and their profile is unlocked for editing.', type: 'success' });
        setUpdateRequests(prev => prev.filter(req => req.userId !== userId));
      } else {
        const data = await response.json();
        setNotification({ message: `Failed to allow update: ${data.message || 'Unknown error'}`, type: 'error' });
      }
    } catch (error) {
      setNotification({ message: 'An error occurred while allowing the update.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const renderUpdateRequests = () => {
    return (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900">Profile Update Requests</h2>
          {updateRequests.length === 0 && !isLoading ? (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-700">There are no pending requests to update profiles.</p>
              </div>
          ) : (
              <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Employee ID</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Employee Name</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {updateRequests.map(req => (
                        <tr key={req.userId} className="hover:bg-gray-50 transition duration-150">
                          <td className="px-6 py-4 whitespace-nowrap text-gray-900">{req.employeeId}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-900">{req.fullName}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                                onClick={() => handleAllowUpdate(req.userId)}
                                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200 text-sm"
                                disabled={isLoading}
                            >
                              Allow Update
                            </button>
                          </td>
                        </tr>
                    ))}
                    </tbody>
                  </table>
                </div>
              </div>
          )}
        </div>
    );
  };

  const handleViewDocument = async (fileName) => {
    const token = localStorage.getItem('authToken');
    try {
      const response = await fetch(`http://localhost:8081/api/documents/view/${fileName}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error('Could not download file.');
      }

      const blob = await response.blob();
      const fileUrl = window.URL.createObjectURL(blob);
      window.open(fileUrl, '_blank');

    } catch (error) {
      setNotification({ message: 'Failed to open document.', type: 'error' });
    }
  };
  const renderLeaveCalendar = () => {
    const calendarDays = generateCalendarDays();
    const monthName = currentMonth.toLocaleString('default', { month: 'long' });
    const year = currentMonth.getFullYear();

    const getLeaveColor = (type, isHalfDay, isHoliday) => {
      if (isHoliday) return 'bg-purple-200 border-purple-500 text-red-900';
      switch (type) {
        case 'cl': return 'bg-yellow-200 border-yellow-500 text-yellow-900';
        case 'el': return 'bg-green-200 border-green-500 text-green-900';
        case 'lwp': return 'bg-gray-200 border-gray-500 text-gray-900';
        case 'maternity': return 'bg-pink-200 border-pink-500 text-pink-900';
        case 'paternity': return 'bg-blue-200 border-blue-500 text-blue-900';
        case 'half_day_cl': return 'bg-orange-200 border-orange-500 text-orange-900';
        case 'half_day_el': return 'bg-teal-200 border-teal-500 text-teal-900';
        case 'half_day_lwp': return 'bg-gray-300 border-gray-600 text-gray-900';
        default: return 'bg-white hover:bg-gray-50';
      }
    };

    const getLeaveTooltip = (type, isHalfDay, isHoliday) => {
      if (isHoliday) {
        const holiday = holidays.find(h => h.date === `${year}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(calendarDays.find(d => d.isHoliday)?.day).padStart(2, '0')}`);
        return holiday ? holiday.name : 'Holiday';
      }
      switch (type) {
        case 'cl': return 'Casual Leave';
        case 'el': return 'Earned Leave';
        case 'lwp': return 'Leave Without Pay';
        case 'maternity': return 'Maternity Leave';
        case 'paternity': return 'Paternity Leave';
        case 'half_day_cl': return 'Half Day Casual Leave';
        case 'half_day_el': return 'Half Day Earned Leave';
        case 'half_day_lwp': return 'Half Day Leave Without Pay';
        default: return '';
      }
    };

    const leaveTypes = [
      { type: 'holiday', label: 'Holiday', bgColor: 'bg-purple-200', borderColor: 'border-purple-500' },
      { type: 'cl', label: 'Casual Leave', bgColor: 'bg-yellow-200', borderColor: 'border-yellow-500' },
      { type: 'el', label: 'Earned Leave', bgColor: 'bg-green-200', borderColor: 'border-green-500' },
      { type: 'lwp', label: 'Leave Without Pay', bgColor: 'bg-gray-200', borderColor: 'border-gray-500' },
      { type: 'maternity', label: 'Maternity Leave', bgColor: 'bg-pink-200', borderColor: 'border-pink-500' },
      { type: 'paternity', label: 'Paternity Leave', bgColor: 'bg-blue-200', borderColor: 'border-blue-500' },
      { type: 'half_day_cl', label: 'Half Day Casual Leave', bgColor: 'bg-orange-200', borderColor: 'border-orange-500' },
      { type: 'half_day_el', label: 'Half Day Earned Leave', bgColor: 'bg-teal-200', borderColor: 'border-teal-500' },
      { type: 'half_day_lwp', label: 'Half Day Leave Without Pay', bgColor: 'bg-gray-300', borderColor: 'border-gray-600' },
    ];

    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{monthName} {year}</h3>
            <div className="flex space-x-1">
              <button
                  onClick={() => handleMonthChange(-1)}
                  className="p-1 rounded-full hover:bg-gray-100 transition duration-200"
                  aria-label="Previous month"
              >
                <ChevronLeft size={16} className="text-gray-700" />
              </button>
              <button
                  onClick={() => handleMonthChange(1)}
                  className="p-1 rounded-full hover:bg-gray-100 transition duration-200"
                  aria-label="Next month"
              >
                <ChevronRight size={16} className="text-gray-700" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-0.5 text-center text-xs font-semibold text-gray-600 mb-2">
            {daysOfWeek.map(day => (
                <div key={`weekday-${day}`} className="py-1">{day}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-0.5 text-[10px]">
            {calendarDays.map((day, index) => (
                <div
                    key={day.day ? `${year}-${monthName}-${day.day}` : `empty-${index}`}
                    className={`aspect-square flex items-center justify-center border rounded-sm font-medium transition-all duration-200 ${
                        day.day ? getLeaveColor(day.leaveType, day.isHalfDay, day.isHoliday) : 'bg-gray-100'
                    } ${day.day && (day.leaveType || day.isHalfDay || day.isHoliday) ? 'cursor-help' : ''}`}
                    title={day.day && (day.leaveType || day.isHalfDay || day.isHoliday) ? getLeaveTooltip(day.leaveType, day.isHalfDay, day.isHoliday) : ''}
                >
                  {day.day || ''}
                </div>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
            {leaveTypes.map(leave => (
                <div key={leave.type} className="flex items-center space-x-1">
                  <div className={`w-3 h-3 ${leave.bgColor} border ${leave.borderColor} rounded-sm`}></div>
                  <span className="text-xs text-gray-700">{leave.label}</span>
                </div>
            ))}
          </div>
        </div>
    );
  };

  const renderHolidayView = () => {
    const sortedHolidays = [...holidays].sort((a, b) => {
      return new Date(a.date) - new Date(b.date);
    });

    return (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-gray-900">Holiday Management</h2>
            <button
                onClick={() => setIsHolidayModalOpen(true)}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
            >
              <Calendar size={16} />
              <span>Add Holiday</span>
            </button>
          </div>
          {sortedHolidays.length === 0 && !isLoading ? (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-700">No holidays defined.</p>
              </div>
          ) : (
              <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {sortedHolidays.map(holiday => (
                        <tr key={holiday.id} className="hover:bg-gray-50 transition duration-150">
                          <td className="px-6 py-4 whitespace-nowrap text-gray-900">{holiday.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-600">{holiday.date}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-600">{holiday.type}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                                onClick={() => handleDeleteHoliday(holiday.id)}
                                className="text-red-600 hover:text-red-800 font-medium transition duration-200"
                                disabled={isLoading}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                    ))}
                    </tbody>
                  </table>
                </div>
              </div>
          )}
        </div>
    );
  };
  const handleDownloadDocument = async (fileName) => {
    const token = localStorage.getItem('authToken');
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:8081/api/documents/view/${fileName}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error('Could not download file.');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      setNotification({ message: 'Document downloaded successfully.', type: 'success' });

    } catch (error){
      setNotification({ message: 'Failed to download document.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const renderPendingSignups = () => {
    const handleDeleteSignup = async (userId) => {
      const token = localStorage.getItem('authToken');
      try {
        setIsLoading(true);
        const response = await fetch(`http://localhost:8081/api/hr/delete-signup/${userId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          setPendingSignups(prev => prev.filter(user => user.id !== userId));
          setNotification({ message: 'Signup request deleted successfully.', type: 'success' });
        } else {
          const data = await response.json().catch(() => ({}));
          setNotification({ message: `Failed to delete signup: ${data.message || 'Unknown error'}`, type: 'error' });
        }
      } catch (error) {
        setNotification({ message: 'Failed to delete signup request.', type: 'error' });
      } finally {
        setIsLoading(false);
      }
    };

    if (pendingSignups.length === 0 && !isLoading) {
      return (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-700">No pending signup requests.</p>
          </div>
      );
    }

    return (
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-x-auto max-w-full">
          <table className="w-full divide-y divide-gray-200 table-fixed">
            <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-[6%] min-w-[40px]">ID</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-[10%] min-w-[80px]">Name</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-[10%] min-w-[70px]">Role</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-[14%] min-w-[90px]">Department</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-[10%] min-w-[60px]">Gender</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-[14%] min-w-[90px]">Reporting To</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-[12%] min-w-[80px]">Join Date</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-[10%] min-w-[60px]">Status</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-[18%] min-w-[140px]">Actions</th>
            </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
            {pendingSignups.map(user => (
                <tr key={user.id} className="hover:bg-gray-50 transition duration-150">
                  <td className="px-3 py-2 whitespace-nowrap text-gray-900 text-xs">{user.employeeId}</td>
                  <td className="px-3 py-2 text-gray-900 truncate text-xs">{user.fullName}</td>
                  <td className="px-3 py-2 text-gray-600 text-xs">{user.role}</td>
                  <td className="px-3 py-2 text-gray-600 text-xs">{user.department || 'N/A'}</td>
                  <td className="px-3 py-2 text-gray-600 text-xs">{user.gender || 'N/A'}</td>
                  <td className="px-3 py-2 text-gray-600 truncate text-xs">{user.reportingToName || 'N/A'}</td>
                  <td className="px-3 py-2 text-gray-600 text-xs">{user.joinDate || 'N/A'}</td>
                  <td className="px-3 py-2 text-gray-600 text-xs">{user.status}</td>
                  <td className="px-3 py-2">
                    <div className="flex space-x-1 flex-nowrap">
                      <button
                          onClick={() => handleApproveSignup(user.id)}
                          className="bg-green-600 text-white px-2 py-1 rounded-md hover:bg-green-700 transition duration-200 text-xs whitespace-nowrap"
                          disabled={isLoading}
                      >
                        Approve
                      </button>
                      <button
                          onClick={() => setDisapproveModal({ open: true, userId: user.id, reason: '' })}
                          className="bg-red-600 text-white px-2 py-1 rounded-md hover:bg-red-700 transition duration-200 text-xs whitespace-nowrap"
                          disabled={isLoading}
                      >
                        Disapprove
                      </button>
                      <button
                          onClick={() => handleDeleteSignup(user.id)}
                          className="bg-gray-600 text-white px-2 py-1 rounded-md hover:bg-gray-700 transition duration-200 text-xs whitespace-nowrap"
                          disabled={isLoading}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
            ))}
            </tbody>
          </table>
        </div>
    );
  };

  const renderDepartmentView = () => {
    const department = departmentData.find(d => d.id === selectedDepartment);
    if (!department) {
      return (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
            <p className="text-sm text-yellow-700">Department not found.</p>
          </div>
      );
    }
    return (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <button
                  onClick={backToOverview}
                  className="p-2 rounded-full hover:bg-gray-100 transition duration-200"
                  aria-label="Back to departments"
              >
                <ChevronLeft size={20} className="text-gray-700" />
              </button>
              <h2 className="text-2xl font-semibold text-gray-900">{department.name}</h2>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center bg-white border border-gray-200 rounded-lg shadow-sm">
                <button
                    onClick={() => handleMonthChange(-1)}
                    className="p-2 hover:bg-gray-100 rounded-l-lg transition duration-200"
                    aria-label="Previous month"
                >
                  <ChevronLeft size={16} className="text-gray-600" />
                </button>
                <span className="px-4 py-2 text-sm font-medium text-gray-800">
                {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </span>
                <button
                    onClick={() => handleMonthChange(1)}
                    className="p-2 hover:bg-gray-100 rounded-r-lg transition duration-200"
                    aria-label="Next month"
                >
                  <ChevronRight size={16} className="text-gray-600" />
                </button>
              </div>
              <button
                  onClick={() => handleExportExcel(selectedDepartment)}
                  className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200"
              >
                <Download size={16} />
                <span>Export Leave Report</span>
              </button>
            </div>
          </div>
          {employeesInDepartment.length === 0 && !isLoading ? (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-700">No employees found in this department.</p>
              </div>
          ) : (
              <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Employee Name</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Position</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {employeesInDepartment.map(employee => (
                        <tr key={employee.id} className="hover:bg-gray-50 transition duration-150">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-gray-900">{employee.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-gray-600">{employee.position}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-4">
                              <button
                                  onClick={() => handleEmployeeClick(employee)}
                                  className="text-blue-600 hover:text-blue-800 font-medium flex items-center space-x-1 transition duration-200"
                              >
                                <span>View Calendar</span>
                                <ChevronRight size={16} />
                              </button>
                              <button
                                  onClick={() => openReportingModal(employee)}
                                  className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center space-x-1 transition duration-200"
                              >
                                <Users size={14} />
                                <span>Change Reporting To</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                    ))}
                    </tbody>
                  </table>
                </div>
              </div>
          )}
        </div>
    );
  };

  const renderEmployeeView = () => {
    if (!selectedEmployee) return null;
    return (
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <button
                onClick={backToDepartment}
                className="p-2 rounded-full hover:bg-gray-100 transition duration-200"
            >
              <ChevronLeft size={20} className="text-gray-700" />
            </button>
            <h2 className="text-2xl font-semibold text-gray-900">{selectedEmployee.name}'s Leave Calendar</h2>
          </div>
          {renderLeaveCalendar()}
        </div>
    );
  };

  const renderDepartmentOverview = () => {
    return (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900">Department Overview</h2>
          {departmentData.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {departmentData.map((dept, index) => (
                    <div
                        key={dept.id ?? `dept-${index}`}
                        onClick={() => handleDepartmentClick(dept.id)}
                        className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-all duration-200 cursor-pointer"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                          <Building size={24} />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">{dept.name}</h3>
                          <div className="mt-2 flex space-x-4">
                            <div className="text-gray-600">
                              <span className="font-medium">{dept.employeeCount}</span> Employees
                            </div>
                            <div className="text-red-600">
                              <span className="font-medium">{dept.onLeaveCount}</span> On Leave
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                ))}
              </div>
          ) : (
              <p className="text-gray-600 text-center py-6">No departments available.</p>
          )}
        </div>
    );
  };

  const renderDashboardView = () => {
    return (
        <div className="space-y-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Key Metrics</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {metrics.map(metric => (
                  <div
                      key={metric.key}
                      className={`bg-white rounded-lg p-5 border-l-4 ${metric.borderColor} shadow-md hover:shadow-lg transition-all duration-200`}
                  >
                    <div className="flex items-center space-x-3">
                      {metric.icon}
                      <div>
                        <div className="text-sm font-medium text-gray-600">{metric.title}</div>
                        <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
                      </div>
                    </div>
                  </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Manage Roles</h3>
                <button
                    onClick={() => setIsRoleModalOpen(true)}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
                >
                  <UserPlus size={16} />
                  <span>Add Role</span>
                </button>
              </div>
              {isLoading ? (
                  <div className="text-center py-6">
                    <p className="text-gray-600">Loading...</p>
                  </div>
              ) : roles.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-gray-600">No roles available. Add a role to get started.</p>
                  </div>
              ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">Role Name</th>
                      </tr>
                      </thead>
                      <tbody>
                      {roles.map((role) => (
                          <tr key={role.id} className="border-b border-gray-200 hover:bg-gray-50 transition duration-150">
                            <td className="py-3 px-4 text-gray-700">{role.id}</td>
                            <td className="py-3 px-4 text-gray-700">{role.name}</td>
                          </tr>
                      ))}
                      </tbody>
                    </table>
                  </div>
              )}
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Manage Departments</h3>
                <button
                    onClick={() => setIsDeptModalOpen(true)}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
                >
                  <Building size={16} />
                  <span>Add Department</span>
                </button>
              </div>
              {isLoading ? (
                  <div className="text-center py-6">
                    <p className="text-gray-600">Loading...</p>
                  </div>
              ) : departmentData.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-gray-600">No departments available. Add a department to get started.</p>
                  </div>
              ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">Department Name</th>
                      </tr>
                      </thead>
                      <tbody>
                      {departmentData.map((dept) => (
                          <tr key={dept.id} className="border-b border-gray-200 hover:bg-gray-50 transition duration-150">
                            <td className="py-3 px-4 text-gray-700">{dept.id}</td>
                            <td className="py-3 px-4 text-gray-700">{dept.name}</td>
                          </tr>
                      ))}
                      </tbody>
                    </table>
                  </div>
              )}
            </div>
          </div>
        </div>
    );
  };
  const renderMainContent = () => {
    if (isLoading) {
      return (
          <div className="flex justify-center items-center h-64">
            <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M12 2a10 10 0 0110 10 10 10 0 01-10 10 10 10 0 01-10-10 10 10 0 0110-10zM12 4a8 8 0 00-8 8 8 8 0 008 8 8 8 0 008-8 8 8 0 00-8-8z"></path>
            </svg>
          </div>
      );
    }

    if (error) {
      return (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <p className="text-sm text-red-700">{error}</p>
          </div>
      );
    }
    if (selectedProfile) {
      return renderProfileDetailView();
    }
    if (activeView === 'update-requests') {
      return renderUpdateRequests();
    }
    if (selectedEmployee) {
      return renderEmployeeView();
    }
    if (selectedDepartment) {
      return renderDepartmentView();
    }
    if (activeView === 'department-overview') {
      return renderDepartmentOverview();
    }
    if (activeView === 'pending-signups') {
      return renderPendingSignups();
    }
    if (activeView === 'holidays') {
      return renderHolidayView();
    }
    if (activeView === 'profile-verification') {
      return renderProfileVerificationList();
    }
    return renderDashboardView();
  };

  const metrics = [
    { key: 'total-employees', title: 'Total Employees', value: overallData.totalEmployees, borderColor: 'border-blue-500', icon: <Users size={24} className="text-blue-500" /> },
    { key: 'on-leave-today', title: 'On Leave Today', value: overallData.onLeaveToday, borderColor: 'border-red-500', icon: <Clock size={24} className="text-red-500" /> },
    { key: 'approved-leaves', title: 'Approved Leaves', value: overallData.approvedLeaves, borderColor: 'border-green-500', icon: <CheckCircle size={24} className="text-green-500" /> },
    { key: 'pending-leaves', title: 'Pending Leaves', value: overallData.pendingLeaves, borderColor: 'border-yellow-500', icon: <AlertCircle size={24} className="text-yellow-500" /> },
  ];

  const sidebarItems = [
    { view: 'dashboard', label: 'Dashboard', icon: Users, count: 0 },
    { view: 'department-overview', label: 'Department Overview', icon: Building, count: 0 },
    { view: 'pending-signups', label: 'Pending Signup Requests', icon: FileText, count: pendingSignups.length },
    { view: 'profile-verification', label: 'Profile Verification', icon: UserCheck, count: profileVerificationList.filter(p => p.profileVerificationStatus === 'SUBMITTED').length },
    { view: 'update-requests', label: 'Profile Update Requests', icon: Bell, count: updateRequests.length },
    { view: 'holidays', label: 'Manage Holidays', icon: Calendar, count: 0 }
  ];

  return (
      <div className="min-h-screen bg-gray-50 flex font-sans">
        <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-blue-900 text-white transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out shadow-lg`}>
          <div className="flex items-center justify-between p-4 border-b border-blue-800">
            <div className="flex items-center space-x-3">
              <img src="/Images/bisag_logo.png" alt="BISAG-N Logo" className="h-10 w-10 rounded-full" />
              <span className="text-xl font-semibold">BISAG-N HRMS</span>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden">
              <X size={24} />
            </button>
          </div>
          <nav className="p-4 space-y-2">
            {sidebarItems.map(item => (
                <button
                    key={item.view}
                    onClick={() => {
                      setActiveView(item.view);
                      setSelectedDepartment(null);
                      setSelectedEmployee(null);
                      setSelectedProfile(null);
                    }}
                    className={`relative flex items-center w-full p-3 text-left rounded-lg transition duration-200 ${
                        activeView === item.view ? 'bg-blue-800' : 'hover:bg-blue-800'
                    }`}
                >
                  <item.icon size={20} className="mr-3" />
                  <span>{item.label}</span>
                  {item.count > 0 && (
                      <span className="absolute top-1.5 right-1.5 flex items-center justify-center h-5 w-5 bg-red-500 text-white text-xs font-bold rounded-full">
            {item.count}
          </span>
                  )}
                </button>
            ))}
            <button
                onClick={handleLogout}
                className="flex items-center w-full p-3 text-left rounded-lg hover:bg-red-600 transition duration-200"
            >
              <LogOut size={20} className="mr-3" />
              Logout
            </button>
          </nav>
        </div>

        <div className="flex-1 flex flex-col lg:ml-64">
          <header className="bg-white shadow-lg p-4 flex items-center justify-between">
            <div className="flex items-center">
              <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden mr-4">
                <Menu size={24} className="text-gray-700" />
              </button>
              <h1 className="text-2xl font-semibold text-gray-900">HR Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 font-medium">Welcome, {userData?.fullName || 'HR Manager'}</span>
              <img src="/Images/bisag_logo.png" alt="BISAG-N Logo" className="h-8 w-8 rounded-full" />
            </div>
          </header>

          <main className="flex-1 p-8">
            {notification.message && (
                <div className={`border rounded-lg p-4 mb-8 shadow-sm ${notification.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                  <p className="text-sm font-medium">{notification.message}</p>
                </div>
            )}
            <div className="space-y-8">
              {renderMainContent()}
            </div>
          </main>

          <footer className="bg-blue-900 text-white py-4 text-center">
            <p className="text-sm">© 2025 BISAG-N. All rights reserved.</p>
          </footer>
        </div>
        {isReportingModalOpen && selectedEmployeeForReportingChange && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Change Reporting Person</h3>
                <p className="text-sm text-gray-600 mb-6">For: <span className="font-medium">{selectedEmployeeForReportingChange.name}</span></p>
                <form onSubmit={handleReportingPersonChange}>
                  <div className="mb-6">
                    <label htmlFor="reportingTo" className="block text-sm font-medium text-gray-700 mb-2">New Reporting Person</label>
                    <select
                        id="reportingTo"
                        value={newReportingToId}
                        onChange={(e) => setNewReportingToId(e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        required
                    >
                      <option value="" disabled>Select an employee</option>
                      {allEmployeesList
                          .filter(emp => emp.id !== selectedEmployeeForReportingChange.id)
                          .map(emp => (
                              <option key={emp.id} value={emp.id}>{emp.fullName} ({emp.employeeId})</option>
                          ))}
                    </select>
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button type="button" onClick={closeReportingModal} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">Cancel</button>
                    <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700" disabled={isLoading}>
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
        )}

        {disapproveModal.open && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Disapprove Signup Request</h2>
                <textarea
                    value={disapproveModal.reason}
                    onChange={(e) => setDisapproveModal({ ...disapproveModal, reason: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    rows={4}
                    placeholder="Enter reason for disapproval"
                />
                <div className="flex justify-end space-x-3 mt-4">
                  <button onClick={() => setDisapproveModal({ open: false, userId: null, reason: '' })} className="bg-gray-600 text-white px-4 py-2 rounded-lg">Cancel</button>
                  <button onClick={handleDisapproveSignup} className="bg-red-600 text-white px-4 py-2 rounded-lg" disabled={isLoading || !disapproveModal.reason.trim()}>Disapprove</button>
                </div>
              </div>
            </div>
        )}

        {rejectionModal.open && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
                <h2 className="text-lg font-semibold text-gray-900">Reject Profile Submission</h2>
                <p className="text-sm text-gray-600 my-4">Please provide a clear reason for rejecting this profile. The user will be notified.</p>
                <textarea
                    value={rejectionModal.reason}
                    onChange={(e) => setRejectionModal({ ...rejectionModal, reason: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    rows={4}
                    placeholder="e.g., Aadhaar card is not legible..."
                />
                <div className="flex justify-end space-x-3 mt-4">
                  <button onClick={() => setRejectionModal({ open: false, userId: null, reason: '' })} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg">Cancel</button>
                  <button onClick={submitProfileRejection} className="bg-red-600 text-white px-4 py-2 rounded-lg" disabled={isLoading || !rejectionModal.reason.trim()}>Confirm Rejection</button>
                </div>
              </div>
            </div>
        )}

        {isRoleModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Add New Role</h3>
                <form onSubmit={handleAddRole}>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Role Name</label>
                    <input type="text" value={newRole} onChange={(e) => setNewRole(e.target.value)} className="block w-full rounded-md border-gray-300 shadow-sm" placeholder="e.g., Senior Developer" />
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button type="button" onClick={() => setIsRoleModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg">Cancel</button>
                    <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg">Add Role</button>
                  </div>
                </form>
              </div>
            </div>
        )}

        {isDeptModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Add New Department</h3>
                <form onSubmit={handleAddDept}>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Department Name</label>
                    <input type="text" value={newDept} onChange={(e) => setNewDept(e.target.value)} className="block w-full rounded-md border-gray-300 shadow-sm" placeholder="e.g., Research & Development"/>
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button type="button" onClick={() => setIsDeptModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg">Cancel</button>
                    <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg">Add Department</button>
                  </div>
                </form>
              </div>
            </div>
        )}

        {isHolidayModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Add New Holiday</h3>
                <form onSubmit={handleAddHoliday}>
                  <div className="mb-6"><label className="block text-sm font-medium text-gray-700 mb-2">Holiday Name</label><input type="text" value={newHoliday.name} onChange={(e) => setNewHoliday({ ...newHoliday, name: e.target.value })} className="block w-full rounded-md border-gray-300 shadow-sm" placeholder="e.g., Diwali"/></div>
                  <div className="mb-6"><label className="block text-sm font-medium text-gray-700 mb-2">Date</label><input type="date" value={newHoliday.date} onChange={(e) => setNewHoliday({ ...newHoliday, date: e.target.value })} className="block w-full rounded-md border-gray-300 shadow-sm"/></div>
                  <div className="mb-6"><label className="block text-sm font-medium text-gray-700 mb-2">Type</label><select value={newHoliday.type} onChange={(e) => setNewHoliday({ ...newHoliday, type: e.target.value })} className="block w-full rounded-md border-gray-300 shadow-sm"><option value="CUSTOM">Custom</option><option value="SUNDAY">Sunday</option><option value="SATURDAY_2_4">2nd/4th Saturday</option></select></div>
                  <div className="flex justify-end space-x-3">
                    <button type="button" onClick={() => setIsHolidayModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg">Cancel</button>
                    <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg">Add Holiday</button>
                  </div>
                </form>
              </div>
            </div>
        )}
      </div>
  );
}