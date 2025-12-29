import React from 'react';
import { Formik } from 'formik';
import type { FormikHelpers } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  occupation: Yup.string().required('Occupation is required'),
  expectedIncome: Yup.number().min(0, 'Income cannot be negative'),
  cnic: Yup.string().required('CNIC is required'),
});

interface KYCFormProps {
  profile?: any;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

export const KYCForm: React.FC<KYCFormProps> = ({ profile, onSubmit, onCancel }) => {
  const initialValues = profile || {
    name: '',
    email: '',
    occupation: '',
    expectedIncome: 0,
    cnic: '',
  };

  const handleSubmit = async (values: any, { setSubmitting }: FormikHelpers<any>) => {
    try {
      await onSubmit(values);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <label>
              Full Name
              <input name="name" value={values.name} onChange={handleChange} onBlur={handleBlur} placeholder="Enter full name" style={{ width: '100%', padding: 8 }} />
              {touched.name && errors.name && <div className="field-error">{String(errors.name)}</div>}
            </label>

            <label>
              Email
              <input name="email" type="email" value={values.email} onChange={handleChange} onBlur={handleBlur} placeholder="Enter email address" style={{ width: '100%', padding: 8 }} />
              {touched.email && errors.email && <div className="field-error">{String(errors.email)}</div>}
            </label>

            <label>
              Occupation
              <select value={values.occupation} onChange={(e) => { handleChange(e); }} onBlur={handleBlur} name="occupation" style={{ width: '100%', padding: 8 }}>
                <option value="">Select occupation</option>
                <option value="Software Engineer">Software Engineer</option>
                <option value="Business Owner">Business Owner</option>
                <option value="Student">Student</option>
                <option value="Housewife">Housewife</option>
                <option value="Retired">Retired</option>
                <option value="Other">Other</option>
              </select>
              {touched.occupation && errors.occupation && <div className="field-error">{String(errors.occupation)}</div>}
            </label>

            <label>
              Expected Monthly Income (PKR)
              <input type="number" name="expectedIncome" min={0} value={values.expectedIncome} onChange={(e) => { const v = Number(e.target.value || 0); handleChange({ target: { name: 'expectedIncome', value: v } } as any); }} onBlur={handleBlur} placeholder="Enter expected income" style={{ width: '100%', padding: 8 }} />
              {touched.expectedIncome && errors.expectedIncome && <div className="field-error">{String(errors.expectedIncome)}</div>}
            </label>

            <label>
              CNIC Number
              <input name="cnic" value={values.cnic} onChange={handleChange} onBlur={handleBlur} placeholder="e.g., 12345-6789012-3" style={{ width: '100%', padding: 8 }} />
              {touched.cnic && errors.cnic && <div className="field-error">{String(errors.cnic)}</div>}
            </label>

            <div style={{ display: 'flex', gap: 8 }}>
              <button type="submit" className="btn-primary" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save Profile'}</button>
              <button type="button" onClick={onCancel} className="btn-secondary">Cancel</button>
            </div>
          </form>
        )}
    </Formik>
  );
};
