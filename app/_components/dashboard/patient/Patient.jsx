"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  const getToken = () => {
    if (typeof window !== "undefined") {
      const user = JSON.parse(localStorage.getItem("User"));
      return user?.tokens;
    }
    return null;
  };

  const token = getToken();

  const fetchPatients = async () => {
   
    
    setLoading(true);
    try {
      const res = await fetch(
        "https://curexmed.runasp.net/api/Patient/GetAll", // Fixed API endpoint
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Response from API:", res);
      
      if (!res.ok) {
        throw new Error(`فشل الاتصال بالخادم: ${res.status}`);
      }
      
      const data = await res.json();
      setPatients(data);
      setError(null);
    } catch (err) {
      console.error("خطأ في جلب بيانات المرضى:", err);
      setError("فشل في جلب بيانات المرضى");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [token]);

  // Format date to be more readable
  const formatDate = (dateString) => {
    if (!dateString) return "غير محدد";
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Filter patients by name, email, phone or national ID
  const filteredPatients = patients.filter((patient) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      (patient.fullName && patient.fullName.toLowerCase().includes(searchTermLower)) ||
      (patient.email && patient.email.toLowerCase().includes(searchTermLower)) ||
      (patient.phoneNumber && patient.phoneNumber.includes(searchTerm)) ||
      (patient.nationalId && patient.nationalId.includes(searchTerm))
    );
  });

  const handleDelete = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا المريض؟")) return;

    try {
      const res = await fetch(
        `https://curexmed.runasp.net/api/Patient/Delete/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (res.ok) {
        fetchPatients();
        alert("تم حذف المريض بنجاح");
      } else {
        throw new Error(`فشل في حذف المريض: ${res.status}`);
      }
    } catch (err) {
      console.error("خطأ في حذف المريض:", err);
      alert("حدث خطأ أثناء حذف المريض");
    }
  };

  const handleEdit = (id) => {
    router.push(`/patient/editpatient/${id}`);
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header section */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-[#376c89]">لوحة التحكم</h2>
            <p className="text-gray-600 mt-1">إدارة بيانات المرضى</p>
          </div>
          <Link
            href="/dashboard/patient/addpatient"
            className="bg-[#376c89] text-white px-6 py-3 rounded-lg hover:bg-[#2a566a] transition flex items-center gap-2 shadow-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            إضافة مريض
          </Link>
        </div>

        {/* Search and filters */}
        <div className="bg-white p-6 shadow-md rounded-lg border border-gray-200 mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <input
              type="text"
              placeholder="ابحث بالاسم، الإيميل، رقم الهاتف أو الرقم القومي..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-4 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#376c89] bg-gray-50"
            />
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#376c89] border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <p className="mt-4 text-gray-600">جاري تحميل بيانات المرضى...</p>
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <div className="bg-red-50 p-4 rounded-lg border border-red-200 mb-6">
            <div className="flex">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="mr-3 text-red-700">{error}</p>
            </div>
            <button 
              onClick={fetchPatients}
              className="mt-3 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition"
            >
              إعادة المحاولة
            </button>
          </div>
        )}

        {/* Table section */}
        {!loading && !error && (
          <div className="bg-white shadow-md rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead>
                  <tr className="bg-gradient-to-r from-[#376c89] to-[#4e8aaa] text-white">
                    <th className="p-4 font-semibold">كود المريض</th>
                    <th className="p-4 font-semibold">الاسم</th>
                
                    <th className="p-4 font-semibold">الرقم القومي</th>
                    <th className="p-4 font-semibold">رقم الهاتف</th>
                    <th className="p-4 font-semibold"> الحالة الاجتماعيه</th>
                    <th className="p-4 font-semibold">الجنس</th>
                    <th className="p-4 font-semibold">تاريخ الميلاد</th>
                    <th className="p-4 font-semibold">العنوان</th>
                    {/* <th className="p-4 font-semibold text-center">إجراءات</th> */}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredPatients.length > 0 ? (
                    filteredPatients.map((patient) => (
                      <tr key={patient.id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-4 font-medium text-gray-800">{patient.patientCode || "—"}</td>
                        <td className="p-4 font-medium text-gray-800">{patient.fullName || "—"}</td>
                        
                        <td className="p-4 text-gray-700">{patient.nationalId || "—"}</td>
                        <td className="p-4 text-gray-700">{patient.phoneNumber || "—"}</td>
                        <td className="p-4 text-gray-700">{patient.maritalStatus || "—"}</td>
                        <td className="p-4 text-gray-700">
                          {patient.sex === "male" ? "ذكر" : patient.sex === "female" ? "أنثى" : "—"}
                        </td>
                        <td className="p-4 text-gray-700">{formatDate(patient.birthDate)}</td>
                        <td className="p-4 text-gray-700">{patient.address || "—"}</td>
                        {/* <td className="p-4 flex justify-center gap-2">
                          <button
                            onClick={() => handleEdit(patient.id)}
                            className="bg-[#376c89] text-white px-3 py-2 rounded-md hover:bg-[#2a566a] transition flex items-center gap-1"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            تعديل
                          </button>
                          <button
                            onClick={() => handleDelete(patient.id)}
                            className="bg-red-50 text-red-600 px-3 py-2 rounded-md hover:bg-red-100 transition flex items-center gap-1 border border-red-200"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            حذف
                          </button>
                        </td> */}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="p-8 text-center">
                        <div className="flex flex-col items-center justify-center text-gray-500">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <p className="text-lg font-medium">لا توجد نتائج مطابقة للبحث</p>
                          <p className="mt-1">جرب تعديل معايير البحث أو إضافة مرضى جدد</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination placeholder - can be implemented later */}
            {patients.length > 0 && (
              <div className="flex justify-between items-center p-4 border-t border-gray-200 bg-gray-50">
                <div className="text-gray-600 text-sm">
                  إجمالي المرضى: {patients.length}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}