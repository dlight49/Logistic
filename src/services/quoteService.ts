import { db } from './firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  query, 
  orderBy,
  Timestamp 
} from 'firebase/firestore';

export interface QuoteRequest {
  id: string;
  userId?: string;
  pickupCity: string;
  pickupCountry: string;
  deliveryCity: string;
  deliveryCountry: string;
  weight: number;
  dimensions: string;
  type: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export const quoteService = {
  async createQuote(data: Omit<QuoteRequest, 'id' | 'status' | 'createdAt'>) {
    const docRef = await addDoc(collection(db, 'quotes'), {
      ...data,
      status: 'pending',
      createdAt: Timestamp.now()
    });
    return docRef.id;
  },

  async getQuotes(): Promise<QuoteRequest[]> {
    const q = query(collection(db, 'quotes'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : data.createdAt
      } as QuoteRequest;
    });
  },

  async updateQuoteStatus(id: string, status: 'approved' | 'rejected') {
    const docRef = doc(db, 'quotes', id);
    await updateDoc(docRef, { status });
  }
};
