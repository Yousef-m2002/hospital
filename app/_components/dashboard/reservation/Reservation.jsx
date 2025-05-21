"use client";

import React, { useState } from 'react';
import { Calendar, Clock, NotebookPen, User, Users, Stethoscope, Check } from 'lucide-react';

export default function Reservation() {
  const [reservationData, setReservationData] = useState({
    clinicId: 1,
    patientId: 1,
    doctorId: 1,
    serviceTypes: [1],
    reservationBy: "",
    notes: null
  });

  const services = {
    1: { name: "كشف عام", price: 150 },
    2: { name: "تنظيف أسنان", price: 120 },
    3: { name: "فحص العيون", price: 95 },
    4: { name: "علاج طبيعي", price: 175 }
  };

  const doctors = {
    1: "د. سارة جونسون",
    2: "د. مايكل تشين",
    3: "د. إيما ويلسون"
  };

  const clinics = {
    1: "مركز شارع الرئيسي الطبي",
    2: "مركز المدينة للرعاية الصحية",
    3: "عيادة الجانب الغربي"
  };

  const patients = {
    1: "جون سميث",
    2: "ماريا جارسيا",
    3: "ديفيد لي"
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto" dir="rtl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">حجز موعد طبي</h2>
        <div className="h-1 w-20 bg-blue-500 rounded"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* العمود الأيمن */}
        <div className="space-y-6">
          {/* اختيار العيادة */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center mb-3">
              <div className="bg-blue-500 p-2 rounded-full">
                <Users className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-semibold text-gray-700 mr-2">العيادة</h3>
            </div>
            <select 
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={reservationData.clinicId}
              onChange={e => setReservationData({...reservationData, clinicId: parseInt(e.target.value)})}
            >
              {Object.entries(clinics).map(([id, name]) => (
                <option key={id} value={id}>{name}</option>
              ))}
            </select>
          </div>

          {/* اختيار الدكتور */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center mb-3">
              <div className="bg-blue-500 p-2 rounded-full">
                <Stethoscope className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-semibold text-gray-700 mr-2">الدكتور</h3>
            </div>
            <select 
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={reservationData.doctorId}
              onChange={e => setReservationData({...reservationData, doctorId: parseInt(e.target.value)})}
            >
              {Object.entries(doctors).map(([id, name]) => (
                <option key={id} value={id}>{name}</option>
              ))}
            </select>
          </div>

          {/* اختيار المريض */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center mb-3">
              <div className="bg-blue-500 p-2 rounded-full">
                <User className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-semibold text-gray-700 mr-2">المريض</h3>
            </div>
            <select 
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={reservationData.patientId}
              onChange={e => setReservationData({...reservationData, patientId: parseInt(e.target.value)})}
            >
              {Object.entries(patients).map(([id, name]) => (
                <option key={id} value={id}>{name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* العمود الأيسر */}
        <div className="space-y-6">
          {/* الخدمات */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center mb-3">
              <div className="bg-blue-500 p-2 rounded-full">
                <Check className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-semibold text-gray-700 mr-2">الخدمات</h3>
            </div>
            <div className="space-y-2">
              {Object.entries(services).map(([id, service]) => (
                <div key={id} className="flex items-center justify-between border-b border-gray-200 py-2 last:border-0">
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id={`service-${id}`} 
                      className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                      checked={reservationData.serviceTypes.includes(parseInt(id))}
                      onChange={(e) => {
                        const serviceId = parseInt(id);
                        if (e.target.checked) {
                          setReservationData({
                            ...reservationData, 
                            serviceTypes: [...reservationData.serviceTypes, serviceId]
                          });
                        } else {
                          setReservationData({
                            ...reservationData,
                            serviceTypes: reservationData.serviceTypes.filter(s => s !== serviceId)
                          });
                        }
                      }}
                    />
                    <label htmlFor={`service-${id}`} className="mr-2 text-gray-700">{service.name}</label>
                  </div>
                  <span className="font-medium text-gray-800">${service.price}</span>
                </div>
              ))}
            </div>
          </div>

          {/* التاريخ والوقت */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center mb-3">
              <div className="bg-blue-500 p-2 rounded-full">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-semibold text-gray-700 mr-2">التاريخ والوقت</h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input 
                type="date" 
                className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <input 
                type="time" 
                className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* الملاحظات */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center mb-3">
              <div className="bg-blue-500 p-2 rounded-full">
                <NotebookPen className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-semibold text-gray-700 mr-2">ملاحظات</h3>
            </div>
            <textarea 
              className="w-full p-2 border border-gray-300 rounded-md h-24 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="أضف أي متطلبات خاصة أو معلومات إضافية..."
              value={reservationData.notes || ""}
              onChange={e => setReservationData({...reservationData, notes: e.target.value})}
            ></textarea>
          </div>
        </div>
      </div>

      {/* تم الحجز بواسطة */}
      <div className="mt-6 bg-blue-50 p-4 rounded-lg">
        <div className="flex items-center mb-3">
          <div className="bg-blue-500 p-2 rounded-full">
            <User className="h-5 w-5 text-white" />
          </div>
          <h3 className="font-semibold text-gray-700 mr-2">تم الحجز بواسطة</h3>
        </div>
        <input 
          type="text" 
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="اسم الشخص الذي قام بالحجز"
          value={reservationData.reservationBy}
          onChange={e => setReservationData({...reservationData, reservationBy: e.target.value})}
        />
      </div>

      {/* الزر والمجموع الكلي */}
      <div className="mt-8">
        <div className="mb-4 bg-blue-100 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-700">الإجمالي:</span>
            <span className="text-xl font-bold text-blue-700">
              ${reservationData.serviceTypes.reduce((total, serviceId) => 
                total + (services[serviceId]?.price || 0), 0)}
            </span>
          </div>
        </div>
        <div className="flex justify-start">
          <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg font-medium shadow-md transition-colors duration-200 flex items-center">
            <Clock className="h-5 w-5 ml-2" />
            تأكيد الحجز
          </button>
        </div>
      </div>
    </div>
  );
}
