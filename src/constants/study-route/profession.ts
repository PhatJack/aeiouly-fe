export type Profession = {
  id: string;
  label: string;
};

export const PROFESSIONS: Profession[] = [
  { id: 'student', label: 'Học sinh / Sinh viên' },
  { id: 'office_worker', label: 'Nhân viên văn phòng' },
  { id: 'software_engineer', label: 'Lập trình viên / IT' },
  { id: 'designer', label: 'Designer / Thiết kế' },
  { id: 'marketing', label: 'Marketing / Truyền thông' },
  { id: 'sales', label: 'Bán hàng / Sales' },
  { id: 'customer_support', label: 'Chăm sóc khách hàng' },
  { id: 'teacher', label: 'Giáo viên / Giảng viên' },
  { id: 'healthcare', label: 'Y tế / Chăm sóc sức khỏe' },
  { id: 'engineer', label: 'Kỹ sư (không IT)' },
  { id: 'finance', label: 'Tài chính / Kế toán' },
  { id: 'hr', label: 'Nhân sự (HR)' },
  { id: 'business_owner', label: 'Chủ doanh nghiệp / Startup' },
  { id: 'freelancer', label: 'Freelancer' },
  { id: 'content_creator', label: 'Content Creator / Creator' },
  { id: 'tourism_hospitality', label: 'Du lịch / Nhà hàng / Khách sạn' },
  { id: 'logistics', label: 'Logistics / Xuất nhập khẩu' },
  { id: 'manufacturing', label: 'Sản xuất / Nhà máy' },
  { id: 'government', label: 'Cơ quan nhà nước' },
  { id: 'researcher', label: 'Nghiên cứu' },
  { id: 'job_seeker', label: 'Đang tìm việc' },
  { id: 'stay_at_home', label: 'Nội trợ' },
  { id: 'retired', label: 'Đã nghỉ hưu' },
  { id: 'other', label: 'Khác' },
];
