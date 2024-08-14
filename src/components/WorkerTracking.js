import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, Form, Input, DatePicker, TimePicker, Select, Typography, Tag, Popconfirm, message, Statistic, Row, Col, Tooltip, Progress, Table, Space, Drawer } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, CheckCircleOutlined, SearchOutlined, FilterOutlined, ExportOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const WorkerTracking = () => {
  const [workers, setWorkers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [isWorkerModalVisible, setIsWorkerModalVisible] = useState(false);
  const [isTaskModalVisible, setIsTaskModalVisible] = useState(false);
  const [currentWorker, setCurrentWorker] = useState(null);
  const [editingWorkerId, setEditingWorkerId] = useState(null);
  const [workerForm] = Form.useForm();
  const [taskForm] = Form.useForm();
  const [filterDrawerVisible, setFilterDrawerVisible] = useState(false);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const savedWorkers = JSON.parse(localStorage.getItem('workers')) || [];
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    setWorkers(savedWorkers);
    setTasks(savedTasks);
    setFilteredTasks(savedTasks);
  }, []);

  useEffect(() => {
    localStorage.setItem('workers', JSON.stringify(workers));
    localStorage.setItem('tasks', JSON.stringify(tasks));
    filterTasks();
  }, [workers, tasks, searchText]);

  const showWorkerModal = (worker = null) => {
    setEditingWorkerId(worker ? worker.id : null);
    workerForm.setFieldsValue(worker || {});
    setIsWorkerModalVisible(true);
  };

  const handleWorkerOk = () => {
    workerForm.validateFields().then(values => {
      if (editingWorkerId) {
        setWorkers(workers.map(w => w.id === editingWorkerId ? { ...w, ...values } : w));
        message.success('İşçi bilgileri güncellendi');
      } else {
        const newWorker = { id: Date.now(), ...values };
        setWorkers([...workers, newWorker]);
        message.success('Yeni işçi eklendi');
      }
      setIsWorkerModalVisible(false);
      workerForm.resetFields();
    });
  };

  const showTaskModal = (worker) => {
    setCurrentWorker(worker);
    setIsTaskModalVisible(true);
  };

  const handleTaskOk = () => {
    taskForm.validateFields().then(values => {
      const newTask = {
        id: Date.now(),
        workerId: currentWorker.id,
        ...values,
        date: values.date.format('YYYY-MM-DD'),
        time: values.time.format('HH:mm'),
        status: 'Devam Ediyor'
      };
      setTasks([...tasks, newTask]);
      setIsTaskModalVisible(false);
      taskForm.resetFields();
      message.success('Yeni görev eklendi');
    });
  };

  const deleteWorker = (workerId) => {
    setWorkers(workers.filter(w => w.id !== workerId));
    setTasks(tasks.filter(t => t.workerId !== workerId));
    message.success('İşçi silindi');
  };

  const completeTask = (taskId) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status: 'Tamamlandı', completionTime: moment().format('YYYY-MM-DD HH:mm') } : t));
    message.success('Görev tamamlandı');
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter(t => t.id !== taskId));
    message.success('Görev silindi');
  };

  const getWorkerStats = (workerId) => {
    const workerTasks = tasks.filter(t => t.workerId === workerId);
    const completedTasks = workerTasks.filter(t => t.status === 'Tamamlandı').length;
    const totalTasks = workerTasks.length;
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    return { completedTasks, totalTasks, completionRate };
  };

  const filterTasks = () => {
    let filtered = tasks;
    if (searchText) {
      filtered = filtered.filter(task => 
        task.task.toLowerCase().includes(searchText.toLowerCase()) ||
        workers.find(w => w.id === task.workerId)?.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    setFilteredTasks(filtered);
  };

  const exportToCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "İşçi Adı,Görev,Tarih,Saat,Durum,Detaylar\n"
      + filteredTasks.map(task => {
        const worker = workers.find(w => w.id === task.workerId);
        return `${worker.name},${task.task},${task.date},${task.time},${task.status},${task.details}`;
      }).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "gorevler.csv");
    document.body.appendChild(link);
    link.click();
  };

  const columns = [
    {
      title: 'İşçi',
      dataIndex: 'workerId',
      key: 'worker',
      render: workerId => workers.find(w => w.id === workerId)?.name,
    },
    {
      title: 'Görev',
      dataIndex: 'task',
      key: 'task',
    },
    {
      title: 'Tarih',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Saat',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: 'Durum',
      dataIndex: 'status',
      key: 'status',
      render: status => (
        <Tag color={status === 'Tamamlandı' ? 'green' : 'blue'}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'İşlemler',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Popconfirm
            title="Bu görevi tamamlamak istediğinizden emin misiniz?"
            onConfirm={() => completeTask(record.id)}
            okText="Evet"
            cancelText="Hayır"
            disabled={record.status === 'Tamamlandı'}
          >
            <Button 
              icon={<CheckCircleOutlined />} 
              disabled={record.status === 'Tamamlandı'}
            >
              Tamamla
            </Button>
          </Popconfirm>
          <Popconfirm
            title="Bu görevi silmek istediğinizden emin misiniz?"
            onConfirm={() => deleteTask(record.id)}
            okText="Evet"
            cancelText="Hayır"
          >
            <Button icon={<DeleteOutlined />} danger>Sil</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <Title level={2}>İşçi Takip Sistemi</Title>
      
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Card>
            <Statistic title="Toplam İşçi Sayısı" value={workers.length} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Toplam Görev Sayısı" value={tasks.length} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic 
              title="Tamamlanan Görevler" 
              value={tasks.filter(t => t.status === 'Tamamlandı').length} 
              suffix={`/ ${tasks.length}`} 
            />
          </Card>
        </Col>
      </Row>

      <Title level={3} style={{ marginTop: '20px' }}>İşçiler</Title>
      <Button icon={<PlusOutlined />} onClick={() => showWorkerModal()} style={{ marginBottom: '20px' }}>
        Yeni İşçi Ekle
      </Button>
      <Row gutter={[16, 16]}>
        {workers.map(worker => {
          const stats = getWorkerStats(worker.id);
          return (
            <Col xs={24} sm={12} md={8} lg={6} key={worker.id}>
              <Card
                title={worker.name}
                extra={
                  <Button.Group>
                    <Tooltip title="Düzenle">
                      <Button icon={<EditOutlined />} onClick={() => showWorkerModal(worker)} />
                    </Tooltip>
                    <Popconfirm
                      title="Bu işçiyi silmek istediğinizden emin misiniz?"
                      onConfirm={() => deleteWorker(worker.id)}
                      okText="Evet"
                      cancelText="Hayır"
                    >
                      <Tooltip title="Sil">
                        <Button icon={<DeleteOutlined />} danger />
                      </Tooltip>
                    </Popconfirm>
                  </Button.Group>
                }
              >
                <Paragraph><strong>Pozisyon:</strong> {worker.position}</Paragraph>
                <Paragraph><strong>İletişim:</strong> {worker.contact}</Paragraph>
                <Progress percent={Math.round(stats.completionRate)} status="active" />
                <Row gutter={16}>
                  <Col span={12}>
                    <Statistic title="Tamamlanan" value={stats.completedTasks} />
                  </Col>
                  <Col span={12}>
                    <Statistic title="Toplam" value={stats.totalTasks} />
                  </Col>
                </Row>
                <Button onClick={() => showTaskModal(worker)} style={{ marginTop: '10px' }} block>
                  Yeni Görev Ekle
                </Button>
              </Card>
            </Col>
          );
        })}
      </Row>

      <Title level={3} style={{ marginTop: '20px' }}>Görevler</Title>
      <Space style={{ marginBottom: '16px' }}>
        <Input
          placeholder="Görev veya işçi ara"
          prefix={<SearchOutlined />}
          onChange={e => setSearchText(e.target.value)}
        />
        <Button icon={<FilterOutlined />} onClick={() => setFilterDrawerVisible(true)}>
          Filtrele
        </Button>
        <Button icon={<ExportOutlined />} onClick={exportToCSV}>
          CSV'ye Aktar
        </Button>
      </Space>
      <Table columns={columns} dataSource={filteredTasks} rowKey="id" />

      {/* İşçi Ekleme/Düzenleme Modalı */}
      <Modal
        title={editingWorkerId ? "İşçi Düzenle" : "Yeni İşçi Ekle"}
        visible={isWorkerModalVisible}
        onOk={handleWorkerOk}
        onCancel={() => setIsWorkerModalVisible(false)}
      >
        <Form form={workerForm} layout="vertical">
          <Form.Item name="name" label="Ad Soyad" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="position" label="Pozisyon" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="contact" label="İletişim Bilgisi" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      {/* Görev Ekleme Modalı */}
      <Modal
        title={`${currentWorker?.name || ''} için Yeni Görev Ekle`}
        visible={isTaskModalVisible}
        onOk={handleTaskOk}
        onCancel={() => setIsTaskModalVisible(false)}
      >
        <Form form={taskForm} layout="vertical">
          <Form.Item name="task" label="Görev" rules={[{ required: true }]}>
            <Select>
              <Option value="Sökme">Sökme</Option>
              <Option value="Takma">Takma</Option>
              <Option value="Tamir">Tamir</Option>
              <Option value="Bakım">Bakım</Option>
              <Option value="Kontrol">Kontrol</Option>
            </Select>
          </Form.Item>
          <Form.Item name="date" label="Tarih" rules={[{ required: true }]}>
            <DatePicker />
          </Form.Item>
          <Form.Item name="time" label="Saat" rules={[{ required: true }]}>
            <TimePicker format="HH:mm" />
          </Form.Item>
          <Form.Item name="details" label="Detaylar">
            <TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>

      {/* Filtre Çekmecesi */}
      <Drawer
        title="Görev Filtreleme"
        placement="right"
        closable={false}
        onClose={() => setFilterDrawerVisible(false)}
        visible={filterDrawerVisible}
      >
        {/* Buraya filtre bileşenleri eklenebilir */}
        <p>Filtre özellikleri buraya eklenecek</p>
      </Drawer>
    </div>
  );
};

export default WorkerTracking;