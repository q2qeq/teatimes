import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import axios from 'axios';

import GeneralProfileForm from '../components/GeneralProfileForm.jsx';
import MentorProfileForm from '../components/MentorProfileForm.jsx';

export default function ProfileSetup() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
  const signUpData = location.state?.signUpData;
  const token = searchParams.get('token');
  const userId = searchParams.get('id');

  const [activeTab, setActiveTab] = useState('general');
  const [isMentor, setIsMentor] = useState(false);
  const [portfolioFile, setPortfolioFile] = useState(null);
  const [mentorResumeFile, setMentorResumeFile] = useState(null);
  const [dbEmail, setDbEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // 임시 입력용 상태들
  const [tempCareer, setTempCareer] = useState('');
  const [tempHashtag, setTempHashtag] = useState('');
  const [tempLink, setTempLink] = useState('');
  const [tempKeyword, setTempKeyword] = useState('');

  const [formData, setFormData] = useState({
    name: '', bio: '', mbti: '', hashtags: [], experience: [], portfolio_url: '', 
    help_provide: [], help_receive: [], phone_number: '', 
    main_category: '', sub_category: '', status: '', profile_image: '',
    portfolio_file_path: '', mentor_job: '', mentor_careers: [], mentor_hashtags: [], 
    mentor_story: '', mentor_keywords: [], mentor_experiences: [{ id: Date.now(), text: '' }], mentor_links: []
  });

  // 헬퍼 함수들
  const safeParse = (data, fallback) => {
    if (!data) return fallback;
    try {
      return typeof data === 'string' ? JSON.parse(data) : data;
    } catch { return fallback; }
  };

  const stripHTML = (html) => html ? html.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ').trim() : '';

  // ── 태그/배열 처리 로직 ──
  const handleKeyDownArray = (e, field, value, setValue) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (e.nativeEvent.isComposing) return;
      if (value.trim() && !formData[field].includes(value.trim())) {
        setFormData({ ...formData, [field]: [...formData[field], value.trim()] });
      }
      setValue('');
    }
  };

  const handleRemoveArrayItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  // ── 데이터 로딩 ──────────────────────────────────────────────────────
  useEffect(() => {
    window.scrollTo(0, 0);
    if (signUpData) {
      setDbEmail(signUpData.email || '');
      setFormData(prev => ({ ...prev, name: signUpData.name || '', phone_number: signUpData.phone_number || '' }));
      if (['mentor', 'host'].includes(signUpData.role)) setIsMentor(true);
    }
    if (token) localStorage.setItem('token', token);
    if (userId) localStorage.setItem('userId', userId);

    const fetchProfile = async () => {
      const activeUserId = userId || localStorage.getItem('userId');
      if (!activeUserId) { setIsLoading(false); return; }
      try {
        const res = await axios.get(`${BACKEND_URL}/api/user/${activeUserId}`, {
          headers: { Authorization: `Bearer ${token || localStorage.getItem('token')}` }
        });
        const u = res.data;
        setIsMentor(u.is_mentor || false);
        
        setFormData({
          name: u.name || '', bio: stripHTML(u.bio), mbti: u.mbti || '',
          hashtags: safeParse(u.hashtags, []), experience: safeParse(u.experience, []),
          help_provide: safeParse(u.help_provide, []), help_receive: safeParse(u.help_receive, []),
          portfolio_url: u.portfolio_url || '', phone_number: u.phone_number || '',
          main_category: u.main_category || '', sub_category: u.sub_category || '',
          status: u.status || '', profile_image: u.profile_image || '',
          portfolio_file_path: u.portfolio_file_path || '',
          mentor_job: u.job_title || '',
          mentor_careers: safeParse(u.career_history, []),
          mentor_hashtags: safeParse(u.mentoring_topics, []),
          mentor_story: stripHTML(u.mentor_intro || u.mentor_story),
          mentor_keywords: safeParse(u.mentor_keywords, []),
          mentor_experiences: safeParse(u.detailed_experience || u.mentor_experiences, [{ id: Date.now(), text: '' }]),
          mentor_links: safeParse(u.mentor_links, [])
        });
      } catch (e) { console.error(e); } finally { setIsLoading(false); }
    };
    fetchProfile();
  }, [userId, token, searchParams, signUpData]);

  // ── 제출 로직 ────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        career_history: JSON.stringify(formData.mentor_careers),
        mentoring_topics: JSON.stringify(formData.mentor_hashtags),
        mentor_keywords: JSON.stringify(formData.mentor_keywords),
        detailed_experience: JSON.stringify(formData.mentor_experiences),
        mentor_links: JSON.stringify(formData.mentor_links)
      };
      
      const activeUserId = userId || localStorage.getItem('userId');
      await axios.put(`${BACKEND_URL}/api/user/profile/${activeUserId}`, payload, {
        headers: { Authorization: `Bearer ${token || localStorage.getItem('token')}` }
      });
      alert('🎉 저장되었습니다!');
      navigate('/dashboard');
    } catch (e) { alert('❌ 저장 실패: ' + e.message); }
  };

  const handleExperienceChange = (id, text) => setFormData({ ...formData, mentor_experiences: formData.mentor_experiences.map(item => item.id === id ? { ...item, text } : item) });
  const addExperienceField = () => setFormData({ ...formData, mentor_experiences: [...formData.mentor_experiences, { id: Date.now(), text: '' }] });
  const removeExperienceField = (id) => setFormData({ ...formData, mentor_experiences: formData.mentor_experiences.filter(item => item.id !== id) });

  if (isLoading) return <div>로딩 중...</div>;

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <div className="max-w-4xl mx-auto px-6 pt-12">
        <div className="flex border-b mb-8 bg-white p-1 rounded-xl">
          <button onClick={() => setActiveTab('general')} className={`flex-1 py-3 ${activeTab === 'general' ? 'bg-blue-600 text-white' : ''} rounded-lg`}>일반 프로필</button>
          <button onClick={() => { if (!isMentor) { alert("호스트만 가능합니다."); return; } setActiveTab('mentor'); }} className={`flex-1 py-3 ${activeTab === 'mentor' ? 'bg-purple-600 text-white' : ''} rounded-lg`}>호스트 프로필</button>
        </div>

        <form onSubmit={handleSubmit}>
          {activeTab === 'general' ? (
            <GeneralProfileForm formData={formData} setFormData={setFormData} />
          ) : (
            <MentorProfileForm 
              formData={formData} setFormData={setFormData}
              tempCareer={tempCareer} setTempCareer={setTempCareer}
              tempHashtag={tempHashtag} setTempHashtag={setTempHashtag}
              tempLink={tempLink} setTempLink={setTempLink}
              tempKeyword={tempKeyword} setTempKeyword={setTempKeyword}
              handleKeyDownArray={handleKeyDownArray} handleRemoveArrayItem={handleRemoveArrayItem}
              handleExperienceChange={handleExperienceChange} addExperienceField={addExperienceField} removeExperienceField={removeExperienceField}
            />
          )}
          <button type="submit" className="w-full py-4 mt-8 bg-blue-600 text-white rounded-xl font-bold">최종 저장하기</button>
        </form>
      </div>
    </div>
  );
}