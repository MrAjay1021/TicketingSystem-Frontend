import React, { useState, useEffect } from 'react';
import styles from './IntroductionForm.module.css';

const IntroductionForm = ({ formData, onFormUpdate }) => {
  // Ensure initial state has defined values and create a deep copy to avoid reference issues
  const [form, setForm] = useState({
    fields: formData.fields.map(f => ({ 
      ...f,
      value: f.value || f.placeholder || f.label || '' // Preserve existing value or use defaults
    })),
    submitText: formData.submitText || 'Thank You!'
  });
  
  // Update state when props change
  useEffect(() => {
    console.log('[INTRO FORM] Form data changed:', formData);
    setForm({
      fields: formData.fields.map(f => ({ 
        ...f,
        value: f.value || f.placeholder || f.label || '' // Preserve existing value or use defaults
      })),
      submitText: formData.submitText || 'Thank You!'
    });
  }, [formData]);
  
  // Update a specific field's value by its unique identifier (id or name)
  const handleFieldUpdate = (identifier, key, value) => {
    console.log(`[INTRO FORM] Updating field ${identifier}.${key} to:`, value);
    
    const updatedFields = form.fields.map(item => {
      const isMatch = identifier === item.id || identifier === item.name;
      // Ensure we only update the intended key (e.g., 'value')
      return isMatch ? { ...item, [key]: value } : item; 
    });
    
    const updatedForm = {
      ...form,
      fields: updatedFields
    };
    
    setForm(updatedForm);
    // Pass the updated form data including the new value
    onFormUpdate(updatedForm); 
  };
  
  // Update submit button text
  const handleSubmitTextChange = (text) => {
    console.log('[INTRO FORM] Updating submit text to:', text);
    
    const updatedForm = {
      ...form,
      submitText: text
    };
    
    setForm(updatedForm);
    onFormUpdate(updatedForm);
  };
  
  // Log for debugging
  console.log('[INTRO FORM] Current form state:', form);
  
  return (
    <div className={styles.introductionForm}>
      <div className={styles.formFields}>
        {form.fields.map((field) => {
          const fieldId = field.id || field.name;
          return (
            <div key={fieldId} className={styles.fieldContainer}>
              <div className={styles.fieldHeader}>
                <label className={styles.fieldLabel}>{field.label || field.name}</label>
              </div>
              <div className={styles.fieldInputContainer}>
                <input
                  type="text"
                  className={styles.fieldInput}
                  value={field.value || ''} // Use field.value, default to empty string
                  onChange={(e) => handleFieldUpdate(fieldId, 'value', e.target.value)} // Update 'value' property
                  placeholder={field.placeholder || field.label || field.name} // Use placeholder or fallbacks
                />
              </div>
            </div>
          );
        })}
      </div>
      
      <div className={styles.submitButtonContainer}>
        <label className={styles.submitButtonLabel}>Button Text</label>
        <div className={styles.submitButtonInputContainer}>
          <input
            type="text"
            className={styles.submitButtonInput}
            value={form.submitText || ''} // Ensure value is always defined
            onChange={(e) => handleSubmitTextChange(e.target.value)}
            placeholder="Submit Button Text"
          />
        </div>
      </div>
      
      <div className={styles.formPreview}>
        <button
          className={styles.submitButtonPreview}
        >
          {form.submitText || ''} {/* Ensure preview text is defined */}
        </button>
      </div>
    </div>
  );
};

export default IntroductionForm; 