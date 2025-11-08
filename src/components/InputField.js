import React from 'react';
import { Form } from 'react-bootstrap';

const InputField = ({ label, type = 'text', value, onChange, error }) => (
    <Form.Group className="mb-3">
        <Form.Label>{label}</Form.Label>
        <Form.Control
            type={type}
            value={value}
            onChange={onChange}
            isInvalid={!!error}
        />
        <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
    </Form.Group>
);

export default InputField;
