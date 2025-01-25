import React, { useState } from 'react';
import { Box, Button, Modal, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from '@mui/material';

type Item = {
  description: string;
  amount: number;
  paymentDay: number;
};

const initialData: Item[] = [
  { description: 'Diego', amount: 3200, paymentDay: 5 },
  { description: 'Samanta', amount: 3200, paymentDay: 5 },
];

export const IncomeTable = () => {
  const [items, setItems] = useState<Item[]>(initialData);
  const [isModalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState<Item>({ description: '', amount: 0, paymentDay: 1 });
  const [errors, setErrors] = useState<{ description?: string; amount?: string; paymentDay?: string }>({});

  const toggleModal = () => setModalOpen(!isModalOpen);

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};
    if (!formData.description.trim()) newErrors.description = 'Descrição é obrigatória.';
    if (formData.amount <= 0) newErrors.amount = 'O valor deve ser maior que zero.';
    if (formData.paymentDay < 1 || formData.paymentDay > 31) newErrors.paymentDay = 'Dia de pagamento deve ser entre 1 e 31.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddItem = () => {
    if (validateForm()) {
      setItems((prevItems) => [...prevItems, formData]);
      setFormData({ description: '', amount: 0, paymentDay: 1 });
      toggleModal();
    }
  };

  const handleChange = (field: keyof Item, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Box sx={{width:'600px'}}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Descrição</TableCell>
            <TableCell>Valor (R$)</TableCell>
            <TableCell>Dia de Pagamento</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.description}</TableCell>
              <TableCell>R$ {item.amount.toFixed(2)}</TableCell>
              <TableCell>{item.paymentDay}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button variant="contained" onClick={toggleModal} sx={{ mb: 2 }}>
        Adicionar Renda
      </Button>
      <Modal open={isModalOpen} onClose={toggleModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 1,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Adicionar Item
          </Typography>
          <TextField
            label="Descrição"
            fullWidth
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            error={!!errors.description}
            helperText={errors.description}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Valor (R$)"
            fullWidth
            type="number"
            value={formData.amount}
            onChange={(e) => handleChange('amount', parseFloat(e.target.value))}
            error={!!errors.amount}
            helperText={errors.amount}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Dia de Pagamento"
            fullWidth
            type="number"
            value={formData.paymentDay}
            onChange={(e) => handleChange('paymentDay', parseInt(e.target.value, 10))}
            error={!!errors.paymentDay}
            helperText={errors.paymentDay}
            sx={{ mb: 2 }}
          />
          <Box display="flex" justifyContent="space-between">
            <Button onClick={toggleModal} variant="outlined">
              Cancelar
            </Button>
            <Button onClick={handleAddItem} variant="contained">
              Adicionar
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};
