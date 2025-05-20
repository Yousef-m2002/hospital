"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

export default function AddEmployeePage() {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const [administrations, setAdministrations] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedAdministrationId = watch("administrationId");
  const selectedDepartmentId = watch("departmentId");

  useEffect(() => {
    fetch("https://curexmed.runasp.net/api/Administration/GetAll")
      .then((res) => res.json())
      .then((data) => setAdministrations(data))
      .catch((err) => console.error("Error loading administrations:", err));

    fetch("https://curexmed.runasp.net/api/Shift/GetAll")
      .then((res) => res.json())
      .then((data) => setShifts(data))
      .catch((err) => console.error("Error loading shifts:", err));
  }, []);

  useEffect(() => {
    const admin = administrations.find(
      (a) => a.id === Number(selectedAdministrationId)
    );
    setDepartments(admin?.departments || []);
    setJobs([]);
    reset((formValues) => ({
      ...formValues,
      departmentId: "",
      jobId: "",
    }));
  }, [selectedAdministrationId, administrations, reset]);

  useEffect(() => {
    const dept = departments.find((d) => d.id === Number(selectedDepartmentId));
    setJobs(dept?.jobs || []);
    reset((formValues) => ({
      ...formValues,
      jobId: "",
    }));
  }, [selectedDepartmentId, departments, reset]);

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "خطأ في كلمة المرور",
        text: "كلمة المرور وتأكيدها غير متطابقين",
      });
      return;
    }

    setIsSubmitting(true);
    const token = JSON.parse(localStorage.getItem("User"))?.tokens;

    try {
      const res = await fetch("https://curexmed.runasp.net/api/Employee/Add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "تم إضافة الموظف بنجاح",
          showConfirmButton: false,
          timer: 1500,
        });
        reset();
      } else {
        Swal.fire({
          icon: "error",
          title: "حدثت مشكلة",
          text: "في البيانات أو في السيرفر",
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "خطأ",
        text: "حصل خطأ أثناء الإرسال",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return "";
    return timeString.substring(0, 5);
  };

  const FormSection = ({ title, children }) => (
    <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
      <h3 className="text-lg font-semibold mb-3 text-teal-800 border-b pb-2">
        {title}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
    </div>
  );

  const InputField = ({
    label,
    name,
    type = "text",
    placeholder,
    options,
    disabled = false,
  }) => (
    <div className="mb-2">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      {type === "select" ? (
        <select
          {...register(name)}
          disabled={disabled}
          className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
        >
          <option value="">{placeholder}</option>
          {options?.map((option) => (
            <option
              key={option.id || option.value}
              value={option.id || option.value}
            >
              {option.name || option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          {...register(name)}
          placeholder={placeholder}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
        />
      )}
    </div>
  );

  return (
    <div
      dir="rtl"
      className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-6 mb-12"
    >
      <div className="bg-teal-700 text-white py-4 px-6 rounded-t-lg -mt-6 -mx-6 mb-6">
        <h2 className="text-2xl font-bold">إضافة موظف جديد</h2>
        <p className="text-teal-100 text-sm mt-1">
          أدخل بيانات الموظف الجديد في النموذج أدناه
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <FormSection title="البيانات الشخصية">
          <InputField
            label="الاسم الكامل"
            name="fullName"
            placeholder="أدخل الاسم الكامل"
          />
          <InputField
            label="البريد الإلكتروني"
            name="email"
            placeholder="example@domain.com"
            type="email"
          />
          <InputField
            label="الرقم القومي"
            name="nationalId"
            placeholder="أدخل الرقم القومي"
          />
          <InputField
            label="رقم الهاتف"
            name="phoneNumber"
            placeholder="أدخل رقم الهاتف"
            type="tel"
          />
          <InputField
            label="النوع"
            name="sex"
            type="select"
            placeholder="اختر النوع"
            options={[
              { value: "Male", name: "ذكر" },
              { value: "Female", name: "أنثى" },
            ]}
          />
          <InputField
            label="العنوان"
            name="address"
            placeholder="أدخل العنوان بالتفصيل"
          />
          <InputField label="تاريخ الميلاد" name="birthDate" type="date" />
          <InputField
            label="الحالة الاجتماعية"
            name="maritalStatus"
            type="select"
            placeholder="اختر الحالة"
            options={[
              { value: "Single", name: "أعزب" },
              { value: "Married", name: "متزوج" },
            ]}
          />
        </FormSection>

        <FormSection title="البيانات الوظيفية">
          <InputField
            label="الإدارة"
            name="administrationId"
            type="select"
            placeholder="اختر الإدارة"
            options={administrations}
          />
          <InputField
            label="القسم"
            name="departmentId"
            type="select"
            placeholder="اختر القسم"
            options={departments}
            disabled={!departments.length}
          />
          <InputField
            label="الوظيفة"
            name="jobId"
            type="select"
            placeholder="اختر الوظيفة"
            options={jobs}
            disabled={!jobs.length}
          />
          <InputField
            label="الدور الوظيفي"
            name="role"
            type="select"
            placeholder="اختر الدور"
            options={[
              { value: "Admin", name: "أدمن" },
              { value: "Doctor", name: "طبيب" },
              { value: "Receptionist", name: "استقبال" },
            ]}
          />
          <InputField
            label="الشيفت"
            name="shiftId"
            type="select"
            placeholder="اختر الشيفت"
            options={shifts.map((shift) => ({
              id: shift.id,
              name: `شيفت ${shift.id}: من ${formatTime(
                shift.startTime
              )} إلى ${formatTime(shift.endTime)} - أيام الراحة: ${
                shift.firstDayOff
              }، ${shift.secondDayOff}`,
            }))}
          />
        </FormSection>

        <FormSection title="البيانات المالية">
          <InputField
            label="الراتب الأساسي"
            name="baseSalary"
            type="number"
            placeholder="أدخل الراتب الأساسي"
          />
          <InputField
            label="ساعات العمل الإضافي"
            name="overHourTime"
            type="number"
            placeholder="عدد الساعات"
          />
          <InputField
            label="بدل الانتقال"
            name="travelAllowance"
            type="number"
            placeholder="المبلغ"
          />
          <InputField
            label="بدل الطعام"
            name="mealAllowance"
            type="number"
            placeholder="المبلغ"
          />
          <InputField
            label="نوع التأمين"
            name="insuranceType"
            placeholder="أدخل نوع التأمين"
          />
          <InputField
            label="ساعات التأخير المسموحة"
            name="delayedHours"
            type="number"
            placeholder="عدد الساعات"
          />
          <InputField
            label="عدد أيام الغياب المسموحة سنويًا"
            name="allowedAbsenceDaysPerYear"
            type="number"
            placeholder="عدد الأيام"
          />
        </FormSection>

        <FormSection title="بيانات الدخول">
          <InputField
            label="كلمة المرور"
            name="password"
            type="password"
            placeholder="أدخل كلمة المرور"
          />
          <InputField
            label="تأكيد كلمة المرور"
            name="confirmPassword"
            type="password"
            placeholder="أكد كلمة المرور"
          />
        </FormSection>

        <div className="text-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-teal-700 hover:bg-teal-800 text-white font-bold py-3 px-6 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "جاري الإضافة..." : "إضافة الموظف"}
          </button>
        </div>
      </form>
    </div>
  );
}
