"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function EmployeeEditContainer({ userId }) {
  const defaultValues = {
    fullName: "",
    email: "",
    nationalId: "",
    phoneNumber: "",
    sex: "",
    address: "",
    birthDate: "",
    maritalStatus: "",
    baseSalary: 1,
    overHourTime: 1,
    travelAllowance: 1,
    mealAllowance: 1,
    insuranceType: "",
    delayedHours: 1,
    allowedAbsenceDaysPerYear: 1,
    jobId: 1,
    shiftId: 3,
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm({ defaultValues });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          `https://curexmed.runasp.net/api/Employee/Get/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch user");

        const data = await res.json();
        const transformedData = {
          ...defaultValues,
          ...data,
          shiftId: data.shift?.id || 3,
          jobId: data.job?.id || 1,
        };

        reset(transformedData);


        const mergedData = { ...defaultValues, ...data };

        reset(mergedData); 

        setLoading(false);
      } catch (error) {
        console.error("Error fetching user:", error);
        reset(defaultValues);
        setLoading(false);
      }
    };

    if (userId) {
      fetchUser();
    } else {
      reset(defaultValues);
      setLoading(false);
    }
  }, [userId, reset]);

  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem("token");
      console.log("Updating userId:", userId);
      console.log("Request body:", data);

      const res = await fetch(
        `https://curexmed.runasp.net/api/Employee/Update/${data.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to update user: ${res.status} - ${errorText}`);
      }

      alert("تم تعديل البيانات بنجاح");
    } catch (error) {
      console.error("Error updating user:", error);
      alert("حدث خطأ أثناء التعديل: " + error.message);
    }
  };

  return (
    <div
      style={{
        position: "relative",
        maxWidth: 700,
        margin: "20px auto",
        padding: 20,
        border: "1px solid #ddd",
        borderRadius: 8,
        backgroundColor: "#f9f9f9",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {(loading || isSubmitting) && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: 18,
            fontWeight: "bold",
            color: "#555",
            zIndex: 10,
            borderRadius: 8,
          }}
        >
          {loading ? "جاري تحميل البيانات..." : "جارٍ التعديل..."}
        </div>
      )}

      <h2 style={{ textAlign: "center", marginBottom: 20 }}>
        تعديل بيانات الموظف
      </h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 15,
          }}
        >
          {[
            { label: "الاسم بالكامل", name: "fullName", type: "text" },
            { label: "البريد الإلكتروني", name: "email", type: "email" },
            { label: "الرقم القومي", name: "nationalId", type: "text" },
            { label: "رقم الهاتف", name: "phoneNumber", type: "text" },
            { label: "النوع", name: "sex", type: "text" },
            { label: "العنوان", name: "address", type: "text" },
            { label: "تاريخ الميلاد", name: "birthDate", type: "date" },
            { label: "الحالة الاجتماعية", name: "maritalStatus", type: "text" },
            { label: "المرتب الأساسي", name: "baseSalary", type: "number" },
            {
              label: "أجر الساعة الإضافية",
              name: "overHourTime",
              type: "number",
            },
            { label: "بدل السفر", name: "travelAllowance", type: "number" },
            { label: "بدل الوجبات", name: "mealAllowance", type: "number" },
            { label: "نوع التأمين", name: "insuranceType", type: "text" },
            {
              label: "عدد ساعات التأخير",
              name: "delayedHours",
              type: "number",
            },
            {
              label: "عدد أيام الغياب المسموحة",
              name: "allowedAbsenceDaysPerYear",
              type: "number",
            },
            { label: "معرف الوظيفة", name: "jobId", type: "number" },
            { label: "معرف الشيفت", name: "shiftId", type: "number" },
          ].map(({ label, name, type }) => (
            <div
              key={name}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label
                htmlFor={name}
                style={{ marginBottom: 6, fontWeight: "bold", fontSize: 14 }}
              >
                {label || label.shift.id}
              </label>
              <input
                id={name}
                type={type}
                {...register(name)}
                style={{
                  padding: "8px 10px",
                  fontSize: 14,
                  borderRadius: 4,
                  border: "1px solid #ccc",
                  outline: "none",
                }}
                required
                disabled={loading || isSubmitting}
              />
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || loading}
          style={{
            marginTop: 25,
            width: "100%",
            padding: "12px",
            backgroundColor: isSubmitting ? "#999" : "#0070f3",
            color: "white",
            fontWeight: "bold",
            fontSize: 16,
            border: "none",
            borderRadius: 5,
            cursor: isSubmitting || loading ? "not-allowed" : "pointer",
            transition: "background-color 0.3s ease",
          }}
        >
          {isSubmitting ? "جارٍ التعديل..." : "تعديل البيانات"}
        </button>
      </form>
    </div>
  );
}
