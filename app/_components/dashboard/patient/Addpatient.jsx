"use client"

import React, { useState } from 'react';

export default function AddPatient() {
  const [formData, setFormData] = useState({
    fullName: '',
    sex: '',
    maritalStatus: '',
    phoneNumber: '',
    nationalId: '',
    address: '',
    notes: '',
    birthDate: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('https://curexmed.runasp.net/api/Patient/Create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error('فشل في إرسال البيانات');

      alert('تم إضافة المريض بنجاح');
      setFormData({
        fullName: '',
        sex: '',
        maritalStatus: '',
        phoneNumber: '',
        nationalId: '',
        address: '',
        notes: '',
        birthDate: ''
      });
    } catch (error) {
      alert('حدث خطأ: ' + error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 py-8 px-4">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-[#00786F] py-6 px-8">
          <h2 className="text-2xl font-bold text-white text-center">إضافة مريض جديد</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6" dir="rtl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">الاسم الكامل</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="أدخل الاسم الكامل"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">تاريخ الميلاد</label>
              <input 
                type="date" 
                name="birthDate" 
                value={formData.birthDate} 
                onChange={handleChange} 
                required 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">الجنس</label>
              <select 
                name="sex" 
                value={formData.sex} 
                onChange={handleChange} 
                required 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
              >
                <option value="">اختار</option>
                <option value="male">ذكر</option>
                <option value="female">أنثى</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">الحالة الاجتماعية</label>
              <select 
                name="maritalStatus" 
                value={formData.maritalStatus} 
                onChange={handleChange} 
                required 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
              >
                <option value="">اختار</option>
                <option value="single">أعزب</option>
                <option value="married">متزوج</option>
                <option value="divorced">مطلق</option>
                <option value="widowed">أرمل</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">رقم الهاتف</label>
              <input 
                type="tel" 
                name="phoneNumber" 
                value={formData.phoneNumber} 
                onChange={handleChange} 
                required 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="أدخل رقم الهاتف"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">الرقم القومي</label>
              <input 
                type="text" 
                name="nationalId" 
                value={formData.nationalId} 
                onChange={handleChange} 
                required 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="أدخل الرقم القومي"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">العنوان</label>
            <input 
              type="text" 
              name="address" 
              value={formData.address} 
              onChange={handleChange} 
              required 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="أدخل العنوان"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">ملاحظات</label>
            <textarea 
              name="notes" 
              value={formData.notes} 
              onChange={handleChange} 
              placeholder="اختياري" 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all h-24"
            />
          </div>

          <div className="flex justify-end space-x-3 rtl:space-x-reverse">
            <button 
              type="button" 
              className="px-6 py-2 bg-gray-100 cursor-pointer text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-medium"
              onClick={() => setFormData({
                fullName: '',
                sex: '',
                maritalStatus: '',
                phoneNumber: '',
                nationalId: '',
                address: '',
                notes: '',
                birthDate: ''
              })}
            >
              إلغاء
            </button>
            <button 
              type="submit" 
              className="px-6 py-2 bg-[#00786F] cursor-pointer text-white rounded-lg hover:bg-[#007870d5] transition-all font-medium"
            >
              حفظ المريض
            </button>
          </div>
        </form>
      </div>
    </div>
  )}