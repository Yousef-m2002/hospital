"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import EmployeeEditContainer from "../../../_components/dashboard/employee/EmployeeEditContainer";
import { FaUser, FaUserMd, FaUserTie, FaConciergeBell } from "react-icons/fa";

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [editingUserId, setEditingUserId] = useState(null);
  const getToken = () => {
    if (typeof window !== "undefined") {
      const user = JSON.parse(localStorage.getItem("User"));
      return user?.tokens;
    }
    return null;
  };
  const doctorsCount = students.filter(
    (student) => student.role == "Doctor"
  ).length;
  const Receptionist = students.filter(
    (Receptionist) => Receptionist.role == "Receptionist"
  ).length;
  // const doctorsCount = students.filter(student => student.roles == "Doctor").length;

  const token = getToken();

  const fetchStudents = async () => {
    if (!token) return;
    try {
      const res = await fetch(
        "https://curexmed.runasp.net/api/Employee/GetAll",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      setStudents(data);
    } catch (err) {
      console.error("خطأ في جلب البيانات:", err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [token]);

  const filteredStudents = students.filter((student) => {
    const fullName = `${student.fullName}`.toLowerCase();
    const matchesSearch =
      fullName.includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = filterRole ? student.role?.includes(filterRole) : true;
    return matchesSearch && matchesRole;
  });

  const handleDelete = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا المستخدم؟")) return;

    try {
      const res = await fetch(
        `https://curexmed.runasp.net/api/Employee/Delete/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(`https://curexmed.runasp.net/api/Employee/Delete/${id}`);
      if (res.ok) {
        fetchStudents();
        alert("تم حذف المستخدم بنجاح");
      } else {
        throw new Error("فشل في حذف المستخدم");
      }
    } catch (err) {
      console.error("خطأ في حذف المستخدم:", err);
      alert("حدث خطأ أثناء حذف المستخدم");
    }
  };

  return (
    <div className="p-6 bg-[#376c8913] min-h-screen">
      <div className="max-w-7xl mx-auto ">
        <div className="flex justify-between items-center my-2 mb-8">
          <div className=" text-[#376c89]   ">
            <h2 className="text-2xl font-bold"> لوحة التحكم</h2>
            <p className="text-black">إدارة موظفي المستشفى والعمليات</p>
          </div>
          <div>
            <Link
              href="employee/addEmployee"
              className="border-1 flex   p-3 justify-between w-[120px]  items-center hover:bg-[#376c89d9] transition-all   bg-[#376c89] m-5 ml-0 cursor-pointer text-white rounded-lg"
            >
              <FaUser className="ml-2 size-3" />
              اضافه مستخدم
            </Link>
          </div>
        </div>

        <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex-1 min-w-[200px]">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <FaUser className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">إجمالي المستخدمين</p>
                <p className="text-xl font-bold text-gray-800">
                  {students.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex-1 min-w-[200px]">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-teal-50 rounded-lg">
                <FaUserMd className="w-6 h-6 text-teal-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">عدد الأطباء</p>
                <p className="text-xl font-bold text-teal-700">
                  {doctorsCount}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex-1 min-w-[200px]">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-50 rounded-lg">
                <FaUserTie className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">موظفي الاستقبال</p>
                <p className="text-xl font-bold text-purple-700">
                  {Receptionist}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 shadow-md rounded-lg mt-4 border border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="ابحث بالاسم أو الإيميل..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 flex-grow"
            />
            <div className="flex gap-4">
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              >
                <option value="">جميع الفئات</option>
                <option value="Doctor">طبيب</option>
                <option value="Admin">إداري</option>
                <option value="Receptionist">استقبال</option>
               
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg border border-gray-200 mt-4 overflow-hidden">
          <div className="overflow-x-auto h-[600px]">
            <table className="w-full">
              <thead className="bg-teal-50">
                <tr className="text-right">
                  <th className="p-3  text-center text-teal-800 font-semibold">الاسم</th>
                  <th className="p-3  text-center text-teal-800 font-semibold">الإيميل</th>
                  <th className="p-3  text-center text-teal-800 font-semibold">
                    الرقم القومي
                  </th>
                  <th className="p-3  text-center text-teal-800 font-semibold">الهاتف</th>
                  <th className="p-3  text-center text-teal-800 font-semibold">الدور</th>
                  <th className="p-3   text-teal-800 text-center font-semibold">
                    إجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
                    <tr
                      key={student.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-3  text-center text-gray-700">{student.fullName}</td>
                      <td className="p-3  text-center text-gray-700">{student.email}</td>
                      <td className="p-3  text-center text-gray-700">
                        {student.nationalId}
                      </td>
                      <td className="p-3  text-center text-gray-700">
                        {student.phoneNumber}
                      </td>
                      <td className="p-3  text-center text-gray-700 flex items-center gap-2">
                        {student.role == "Doctor" && (
                          <>
                            <FaUserMd className="text-teal-600 " />
                            <span>دكتور</span>
                          </>
                        )}
                        {student.role == "Admin" && (
                          <>
                            <FaUserTie className="text-purple-600" />
                            <span>إداري</span>
                          </>
                        )}
                        {student.role == "Receptionist" && (
                          <>
                            <FaConciergeBell className="text-pink-600" />
                            <span>موظف استقبال</span>
                          </>
                        )}
                        {student.role == "Nurse" && (
                          <>
                            <FaUser className="text-green-600" />
                            <span>ممرض</span>
                          </>
                        )}
                      </td>

                      <td className="p-3 text-center gap-1 text-nowrap">
                        <button
                          onClick={() => handleDelete(student.id)}
                          className="bg-red-100 text-red-600 px-3 py-1 ml-2 cursor-pointer rounded-lg hover:bg-red-200 transition-colors"
                        >
                          حذف
                        </button>
                        <button
                          className="bg-blue-600 text-white px-3 py-1 cursor-pointer hover:bg-blue-700 rounded"
                          onClick={() => setEditingUserId(student.id)}
                        >
                          تعديل
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="p-4 text-center text-gray-500">
                      لا توجد نتائج مطابقة للبحث
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {editingUserId && (
  <>
    {/* Overlay شفاف يغطي الصفحة كلها */}
    <div
      className="fixed inset-0 bg-black/40 bg-opacity-50 backdrop-blur-sm z-40"
      onClick={() => setEditingUserId(null)} 
    ></div>

    {/* صندوق المودال نفسه */}
    <div className="fixed inset-0 flex items-center  justify-center z-50 p-4">
      <div className="bg-white  rounded-lg shadow-lg max-w-3xl w-full max-h-[90vh] overflow-auto p-6 pt-10 relative">
        <button
          onClick={() => setEditingUserId(null)}
          className="absolute top-2 right-6 cursor-pointer px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
          aria-label="إغلاق"
        >
          إغلاق
        </button>

        <EmployeeEditContainer userId={editingUserId} />
      </div>
    </div>
  </>
)}

        </div>
      </div>
    </div>
  );
}
