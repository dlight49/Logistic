export interface Shipment {
  id: string;
  sender_name: string;
  sender_city: string;
  sender_country: string;
  sender_address: string;
  receiver_name: string;
  receiver_city: string;
  receiver_country: string;
  receiver_address: string;
  receiver_phone: string;
  receiver_email: string;
  status: string;
  weight: number;
  type: string;
  est_delivery: string;
  operator_id?: string;
  created_at: string;
  updates?: TrackingUpdate[];
  docs?: CustomsDoc[];
}

export interface Operator {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'operator';
  assignedShipments?: { id: string; status: string }[];
}

export interface TrackingUpdate {
  id: number;
  shipment_id: string;
  status: string;
  location: string;
  notes: string;
  timestamp: string;
}

export interface CustomsDoc {
  id: number;
  shipment_id: string;
  doc_type: string;
  status: 'verified' | 'pending' | 'missing';
  uploaded_at: string;
}

export interface Stats {
  total: number;
  inTransit: number;
  inCustoms: number;
  issues: number;
  delivered: number;
}
