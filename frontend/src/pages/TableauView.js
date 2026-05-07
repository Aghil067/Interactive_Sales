import React, { useState, useRef } from 'react';
import toast from 'react-hot-toast';
import SalesTrendChart from '../components/charts/SalesTrendChart';
import RegionChart from '../components/charts/RegionChart';
import CategoryChart from '../components/charts/CategoryChart';
import SegmentChart from '../components/charts/SegmentChart';
import { MdUndo, MdRedo, MdRefresh, MdDownload, MdFullscreen, MdShare } from 'react-icons/md';
import { useFilters } from '../context/FilterContext';

export default function TableauView() {
  const [activeTab, setActiveTab] = useState('Executive Overview');
  const { resetFilters } = useFilters();
  const dashboardRef = useRef(null);

  const handleUndo = () => toast('Action undone', { icon: '↩️' });
  const handleRedo = () => toast('Action redone', { icon: '↪️' });
  
  const handleRevert = () => {
    resetFilters();
    toast.success('Filters reset to original view');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Dashboard link copied!');
  };

  const handleFullscreen = () => {
    if (dashboardRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        dashboardRef.current.requestFullscreen();
      }
    }
  };

  const handleDownload = async () => {
    const tid = toast.loading('Generating PDF Report...');
    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import('html2canvas'),
        import('jspdf'),
      ]);
      const el = dashboardRef.current;
      if (!el) throw new Error("Content not found");

      const canvas = await html2canvas(el, { scale: 1.5, useCORS: true, backgroundColor: '#ffffff' });
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF('l', 'mm', 'a4');
      const pdfW = pdf.internal.pageSize.getWidth();
      const pdfH = (canvas.height * pdfW) / canvas.width;
      
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfW, Math.min(pdfH, 210)); 
      pdf.save(`Tableau_${activeTab.replace(/\s+/g, '_')}.pdf`);
      toast.success('PDF downloaded successfully!', { id: tid });
    } catch (err) {
      toast.error('Export failed: ' + err.message, { id: tid });
    }
  };

  const lightThemeVariables = {
    '--bg-card': '#ffffff',
    '--bg-hover': '#f8f9fa',
    '--bg-input': '#f1f5f9',
    '--border': '#e9ecef',
    '--text-primary': '#212529',
    '--text-secondary': '#495057',
    '--text-muted': '#adb5bd',
    '--shadow-hover': '0 4px 12px rgba(0,0,0,0.08)'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 100px)', gap: '20px' }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        background: 'var(--bg-card)',
        padding: '16px 24px',
        borderRadius: '16px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        border: '1px solid var(--border)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
           <div style={{ width: '8px', height: '32px', background: 'var(--accent-1)', borderRadius: '4px' }}></div>
           <div>
             <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>
               Interactive Data Explorer
             </h2>
             <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Powered by Tableau Public</span>
           </div>
        </div>
        
        <div style={{ display: 'flex', gap: '8px', background: 'var(--bg-hover)', padding: '6px', borderRadius: '12px' }}>
          {['Executive Overview', 'Sales & Profit', 'Regional Analysis'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '8px 16px',
                border: 'none',
                borderRadius: '8px',
                background: tab === activeTab ? 'var(--accent-1)' : 'transparent',
                color: tab === activeTab ? '#fff' : 'var(--text-muted)',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.9rem',
                transition: 'all 0.3s ease',
                boxShadow: tab === activeTab ? '0 4px 12px rgba(100, 108, 255, 0.3)' : 'none'
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>      <div 
        ref={dashboardRef}
        style={{ 
        flex: 1, 
        display: 'flex',
        flexDirection: 'column',
        background: '#ffffff', 
        borderRadius: '16px', 
        overflow: 'hidden',
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
        border: '1px solid #e9ecef',
        position: 'relative',
        ...lightThemeVariables
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          padding: '10px 20px', 
          background: '#f8f9fa', 
          borderBottom: '1px solid #e9ecef',
          gap: '15px'
        }}>
          <button onClick={handleUndo} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }} title="Undo"><MdUndo size={20} color="#6c757d" /></button>
          <button onClick={handleRedo} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }} title="Redo"><MdRedo size={20} color="#6c757d" /></button>
          <div style={{ width: '1px', height: '20px', background: '#dee2e6' }}></div>
          <button onClick={handleRevert} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', color: '#495057', fontSize: '13px', fontWeight: 500 }} title="Revert"><MdRefresh size={18} color="#6c757d" /> Revert</button>
          <div style={{ flex: 1 }}></div>
          <button onClick={handleShare} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#495057', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 500 }}>
            <MdShare size={18} color="#6c757d" /> <span style={{ fontSize: '13px' }}>Share</span>
          </button>
          <button onClick={handleDownload} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#495057', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 500 }}>
            <MdDownload size={18} color="#6c757d" /> <span style={{ fontSize: '13px' }}>Download</span>
          </button>
          <button onClick={handleFullscreen} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', marginLeft: '10px' }} title="Full Screen"><MdFullscreen size={24} color="#6c757d" /></button>
        </div>        <div style={{ flex: 1, padding: '20px', overflowY: 'auto', background: '#ffffff' }}>
           {activeTab === 'Executive Overview' && (
             <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', minHeight: '500px' }}>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%' }}>
                 <SalesTrendChart />
               </div>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%' }}>
                 <CategoryChart />
                 <SegmentChart />
               </div>
             </div>
           )}
           {activeTab === 'Sales & Profit' && (
             <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', minHeight: '500px' }}>
               <SalesTrendChart />
               <CategoryChart />
             </div>
           )}
           {activeTab === 'Regional Analysis' && (
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', minHeight: '500px' }}>
               <RegionChart />
               <CategoryChart />
             </div>
           )}
        </div>        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 20px',
          background: '#f8f9fa',
          borderTop: '1px solid #e9ecef',
          fontSize: '12px',
          color: '#868e96'
        }}>
          <div>31 views | Data updated just now</div>
          <div style={{ display: 'flex', gap: '15px' }}>
             <span style={{ cursor: 'pointer', textDecoration: 'underline' }}>Help</span>
             <span style={{ cursor: 'pointer', fontWeight: 600 }}>Powered by Tableau</span>
          </div>
        </div>

      </div>
    </div>
  );
}
