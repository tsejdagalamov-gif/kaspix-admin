'use client';

import { useState, useEffect } from 'react';

interface Document {
  id: string;
  name: string;
  file: string;
  uploadedAt: string;
}

interface Requisites {
  fullName: string;
  documentNumber: string;
  birthDate: string;
  passportData: string;
  address: string;
  phoneNumber: string;
}

export default function PublicPage() {
  const [activeTab, setActiveTab] = useState('document');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [requisites, setRequisites] = useState<Requisites>({
    fullName: '',
    documentNumber: '',
    birthDate: '',
    passportData: '',
    address: '',
    phoneNumber: '',
  });
  const [loading, setLoading] = useState(true);

  // Load data from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('kaspix_data');
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setDocuments(data.documents || []);
        setRequisites(data.requisites || requisites);
      } catch (e) {
        console.error('Failed to load data', e);
      }
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="container">
        <div className="tab-content">
          <p style={{ textAlign: 'center' }}>Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="header">
        <h1>Удостоверение личности</h1>
        <p>Просмотр документов и реквизитов</p>
      </div>

      <div className="tabs">
        <button
          className={`tab-button ${activeTab === 'document' ? 'active' : ''}`}
          onClick={() => setActiveTab('document')}
        >
          Документ
        </button>
        <button
          className={`tab-button ${activeTab === 'requisites' ? 'active' : ''}`}
          onClick={() => setActiveTab('requisites')}
        >
          Реквизиты
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'document' && (
          <div>
            {documents.length > 0 ? (
              <>
                <h2 style={{ marginBottom: '20px' }}>Документы</h2>
                {documents.map((doc) => (
                  <div key={doc.id} className="document-preview">
                    <h3>📋 {doc.name}</h3>
                    <p>Загружено: {doc.uploadedAt}</p>
                    <a href={doc.file} download={doc.name} style={{ display: 'block' }}>
                      ⬇️ Скачать файл
                    </a>
                  </div>
                ))}
              </>
            ) : (
              <div className="empty-state">
                <p>Документы не загружены</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'requisites' && (
          <div>
            {requisites.fullName ||
            requisites.documentNumber ||
            requisites.birthDate ||
            requisites.phoneNumber ? (
              <>
                <h2 style={{ marginBottom: '20px' }}>Реквизиты</h2>
                <div className="requisites-display">
                  {requisites.fullName && <p><strong>ФИО:</strong> {requisites.fullName}</p>}
                  {requisites.documentNumber && <p><strong>Номер документа:</strong> {requisites.documentNumber}</p>}
                  {requisites.birthDate && <p><strong>Дата рождения:</strong> {requisites.birthDate}</p>}
                  {requisites.passportData && <p><strong>Паспорт:</strong> {requisites.passportData}</p>}
                  {requisites.address && <p><strong>Адрес:</strong> {requisites.address}</p>}
                  {requisites.phoneNumber && <p><strong>Телефон:</strong> {requisites.phoneNumber}</p>}
                </div>
              </>
            ) : (
              <div className="empty-state">
                <p>Реквизиты не загружены</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
