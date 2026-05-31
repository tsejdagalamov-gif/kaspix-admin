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

export default function Home() {
  const [activeTab, setActiveTab] = useState('document');
  const [adminPassword, setAdminPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Document states
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [documentSuccess, setDocumentSuccess] = useState('');

  // Requisites states
  const [requisites, setRequisites] = useState<Requisites>({
    fullName: '',
    documentNumber: '',
    birthDate: '',
    passportData: '',
    address: '',
    phoneNumber: '',
  });
  const [requisitesSuccess, setRequisitesSuccess] = useState('');

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

    const storedPassword = localStorage.getItem('kaspix_password');
    if (storedPassword) {
      setAdminPassword(storedPassword);
    }
  }, []);

  // Save data to localStorage
  const saveData = () => {
    const data = {
      documents,
      requisites,
    };
    localStorage.setItem('kaspix_data', JSON.stringify(data));
  };

  // Authentication
  const handleLogin = () => {
    if (password === adminPassword || (adminPassword === '' && password === 'admin123')) {
      setIsAuthenticated(true);
      setPasswordError('');
      if (adminPassword === '') {
        localStorage.setItem('kaspix_password', password);
        setAdminPassword(password);
      }
    } else {
      setPasswordError('Неправильный пароль');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
    setPasswordError('');
  };

  // Document upload
  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDocumentFile(file);
    }
  };

  const handleDocumentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!documentFile) {
      alert('Выберите файл');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const newDocument: Document = {
        id: Date.now().toString(),
        name: documentFile.name,
        file: event.target?.result as string,
        uploadedAt: new Date().toLocaleDateString('ru-RU'),
      };
      setDocuments([...documents, newDocument]);
      saveData();
      setDocumentFile(null);
      setDocumentSuccess('Документ загружен успешно!');
      setTimeout(() => setDocumentSuccess(''), 3000);
    };
    reader.readAsDataURL(documentFile);
  };

  const handleDeleteDocument = (id: string) => {
    if (confirm('Вы уверены?')) {
      setDocuments(documents.filter((doc) => doc.id !== id));
      saveData();
    }
  };

  // Requisites
  const handleRequisitesChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setRequisites((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRequisitesSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveData();
    setRequisitesSuccess('Реквизиты сохранены!');
    setTimeout(() => setRequisitesSuccess(''), 3000);
  };

  if (!isAuthenticated) {
    return (
      <div className="container">
        <div className="header">
          <h1>🔐 Администратор</h1>
          <p>Введите пароль для доступа</p>
        </div>

        <div className="tab-content">
          <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
            <div className="form-group">
              <label>Пароль</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Введите пароль"
              />
              {passwordError && <div className="error">{passwordError}</div>}
            </div>
            <button type="submit" className="button button-primary">
              Войти
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="header">
        <h1>Удостоверение личности</h1>
        <p>Управление документами и реквизитами</p>
        <button onClick={handleLogout} className="button button-secondary" style={{ marginTop: '15px' }}>
          Выход
        </button>
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
            <h2 style={{ marginBottom: '20px' }}>Загрузить документ</h2>
            <form onSubmit={handleDocumentSubmit}>
              <div className="form-group">
                <label>Выберите PDF файл</label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleDocumentUpload}
                />
              </div>
              <button type="submit" className="button button-primary">
                📄 Загрузить документ
              </button>
            </form>

            {documentSuccess && <div className="success">{documentSuccess}</div>}

            {documents.length > 0 && (
              <div style={{ marginTop: '30px' }}>
                <h3 style={{ marginBottom: '15px' }}>Загруженные документы</h3>
                {documents.map((doc) => (
                  <div key={doc.id} className="document-preview">
                    <h3>📋 {doc.name}</h3>
                    <p>Загружено: {doc.uploadedAt}</p>
                    <a href={doc.file} download={doc.name} style={{ display: 'block', marginBottom: '10px' }}>
                      ⬇️ Скачать файл
                    </a>
                    <button
                      onClick={() => handleDeleteDocument(doc.id)}
                      className="button"
                      style={{
                        padding: '8px 16px',
                        background: '#d32f2f',
                        color: 'white',
                        borderRadius: '4px',
                        cursor: 'pointer',
                      }}
                    >
                      🗑️ Удалить
                    </button>
                  </div>
                ))}
              </div>
            )}

            {documents.length === 0 && (
              <div className="empty-state">
                <p>Документы не загружены</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'requisites' && (
          <div>
            <h2 style={{ marginBottom: '20px' }}>Реквизиты</h2>
            <form onSubmit={handleRequisitesSubmit}>
              <div className="form-group">
                <label>ФИО</label>
                <input
                  type="text"
                  name="fullName"
                  value={requisites.fullName}
                  onChange={handleRequisitesChange}
                  placeholder="Фамилия Имя Отчество"
                />
              </div>

              <div className="form-group">
                <label>Номер документа</label>
                <input
                  type="text"
                  name="documentNumber"
                  value={requisites.documentNumber}
                  onChange={handleRequisitesChange}
                  placeholder="Например: AB123456"
                />
              </div>

              <div className="form-group">
                <label>Дата рождения</label>
                <input
                  type="date"
                  name="birthDate"
                  value={requisites.birthDate}
                  onChange={handleRequisitesChange}
                />
              </div>

              <div className="form-group">
                <label>Данные паспорта</label>
                <textarea
                  name="passportData"
                  value={requisites.passportData}
                  onChange={handleRequisitesChange}
                  placeholder="Введите данные паспорта"
                />
              </div>

              <div className="form-group">
                <label>Адрес</label>
                <input
                  type="text"
                  name="address"
                  value={requisites.address}
                  onChange={handleRequisitesChange}
                  placeholder="Полный адрес"
                />
              </div>

              <div className="form-group">
                <label>Номер телефона</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={requisites.phoneNumber}
                  onChange={handleRequisitesChange}
                  placeholder="+7 (XXX) XXX-XX-XX"
                />
              </div>

              <button type="submit" className="button button-primary">
                💾 Сохранить реквизиты
              </button>
            </form>

            {requisitesSuccess && <div className="success">{requisitesSuccess}</div>}

            {(requisites.fullName ||
              requisites.documentNumber ||
              requisites.birthDate ||
              requisites.phoneNumber) && (
              <div style={{ marginTop: '30px' }}>
                <h3 style={{ marginBottom: '15px' }}>Предпросмотр реквизитов</h3>
                <div className="requisites-display">
                  {requisites.fullName && <p><strong>ФИО:</strong> {requisites.fullName}</p>}
                  {requisites.documentNumber && <p><strong>Номер документа:</strong> {requisites.documentNumber}</p>}
                  {requisites.birthDate && <p><strong>Дата рождения:</strong> {requisites.birthDate}</p>}
                  {requisites.passportData && <p><strong>Паспорт:</strong> {requisites.passportData}</p>}
                  {requisites.address && <p><strong>Адрес:</strong> {requisites.address}</p>}
                  {requisites.phoneNumber && <p><strong>Телефон:</strong> {requisites.phoneNumber}</p>}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
