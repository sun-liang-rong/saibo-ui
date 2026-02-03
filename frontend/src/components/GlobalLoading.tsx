import React, { useEffect, useState } from 'react';
import { Spin } from 'antd';
import './GlobalLoading.css';

const GlobalLoading: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleShow = () => setVisible(true);
    const handleHide = () => setVisible(false);

    window.addEventListener('show-loading', handleShow);
    window.addEventListener('hide-loading', handleHide);

    return () => {
      window.removeEventListener('show-loading', handleShow);
      window.removeEventListener('hide-loading', handleHide);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="global-loading">
      <Spin size="large" tip="处理中..." />
    </div>
  );
};

export default GlobalLoading;
