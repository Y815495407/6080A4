import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function EditSlides({ slides, setSlides }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const slide = slides[id];

  if (!slide) {
    return <div>Slide not found.</div>;
  }

  // 删除幻灯片
  const handleDelete = () => {
    if (window.confirm("您确定吗？")) {
      const updatedSlides = slides.filter((_, index) => index !== parseInt(id));
      setSlides(updatedSlides);
      navigate('/dashboard');
    }
  };

  // 返回仪表板
  const handleBack = () => {
    navigate('/dashboard');
  };

  return (
    <div>
      <h1>Edit Slide: {slide.name}</h1>
      <p>{slide.description}</p>

      <button onClick={handleBack}>Back to Dashboard</button>
      <button onClick={handleDelete}>Delete Slide</button>

      {/* 这里可以添加幻灯片内容的编辑功能 */}
    </div>
  );
}

export default EditSlides;
