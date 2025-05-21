import { useState } from "react"
import "./TrainingRecords.css";


const TraningRecords = () => {
    const [trainings, setTrainings] = useState([]);
    const [formData, setFormData] = useState({
      date: '',
      distance: ''
    });
    const [errors, setErrors] = useState({
      date: '',
      distance: ''
    });
  
    const validateForm = () => {
      let isValid = true;
      const newErrors = { date: '', distance: '' };
  

      if (!formData.date) {
        newErrors.date = 'Пожалуйста, введите дату';
        isValid = false;
      } else if (new Date(formData.date) > new Date()) {
        newErrors.date = 'Дата не может быть в будущем';
        isValid = false;
      }
  
      if (!formData.distance) {
        newErrors.distance = 'Пожалуйста, введите расстояние';
        isValid = false;
      } else if (isNaN(parseFloat(formData.distance))) {
        newErrors.distance = 'Расстояние должно быть числом';
        isValid = false;
      } else if (parseFloat(formData.distance) <= 0) {
        newErrors.distance = 'Расстояние должно быть больше 0';
        isValid = false;
      }
  
      setErrors(newErrors);
      return isValid;
    };
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));

      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      
      if (!validateForm()) return;
      
      const existingIndex = trainings.findIndex(t => t.date === formData.date);
      
      if (existingIndex >= 0) {
        const updated = [...trainings];
        updated[existingIndex].distance = (
          parseFloat(updated[existingIndex].distance) + 
          parseFloat(formData.distance)
        ).toString();
        setTrainings(updated);
      } else {
        setTrainings(prev => [...prev, {...formData, id: Date.now()}]);
      }
      
      setFormData({ date: '', distance: '' });
    };
  
    const handleDelete = (id) => {
      setTrainings(prev => prev.filter(training => training.id !== id));
    };
  
    const formatDate = (dateStr) => {
      const date = new Date(dateStr);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}.${month}.${year}`;
    };
  
    const sortedTrainings = [...trainings].sort((a, b) => 
      new Date(b.date) - new Date(a.date)
    );
  
    return (
        <>  
            <form  onSubmit={handleSubmit}>
            <div className="inputForm">
            <div className="form-group">
                <label>Дата(ДД.ММ.ГГ)</label><br />
                <input type="date"
                 name="date" 
                 value={formData.value}
                 onChange={handleChange}
                 className={errors.date ? 'error' : ''}
                 />
                 {errors.date && <div className="error-message">{errors.date}</div>}
            </div>    
            <div className="form-group"> 
                <label>Пройдено КМ</label>
                <input type="text"
                 name="distance"
                 value={formData.distance}
                 onChange={handleChange} className={errors.distance ? 'error' : ''}
                 />
                 {errors.distance && <div className="error-message">{errors.distance}</div>}
            </div>     
                <button className="submit-btn" type="submit">Ок</button>
            </div>
            </form>
            

           <div className="resultTable">
             <div className="tableRow">
                <div>Дата</div>
                <div>Пройдено км</div>
                <div>Действия</div>
             </div>
           {sortedTrainings.map((training, index) => (
             <div className="tableRow" key={index}>
                <div>{formatDate(training.date)}</div>
                <div>{parseFloat(training.distance).toFixed(1)}</div>
                <div><button 
                      onClick={() => handleDelete(training.id)}
                      className="delete-btn"
                      aria-label="Удалить"
                    >
                      ×
                    </button></div>
             </div>
             ))}
           </div>
        </>
    );
}

export default TraningRecords;