'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Building2,
  PlusCircle,
  ShieldCheck,
  RefreshCw,
  Send,
  Trash2,
  ExternalLink,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  KeyRound,
  Search,
  TrendingUp,
  Clock,
  ShieldAlert,
  Users,
  Radio,
  Activity,
  LogOut,
  X,
  FileText,
} from 'lucide-react';

interface TenantItem {
  id: string;
  slug: string;
  ruc: string;
  razon_social: string;
  nombre_comercial: string;
  rubro: string;
  palabras_clave: string[];
  whatsapp_destino: string;
  alertas_activas: boolean;
  plan: string;
  created_at: string;
  stats?: {
    total_licitaciones: number;
    pipeline_pen: number;
    viables: number;
  };
}

interface QueueItem {
  id: string;
  telefono: string;
  tipo: string;
  mensaje: string;
  pdf_url: string;
  estado: 'PENDIENTE' | 'ENVIADO' | 'ERROR';
  created_at: string;
  sent_at?: string;
  error_mensaje?: string;
}

export default function SuperadminClient() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);
  const [adminKeyInput, setAdminKeyInput] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'tenants' | 'create' | 'queue'>('tenants');

  const [tenants, setTenants] = useState<TenantItem[]>([]);
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Formulario de creación
  const [newRuc, setNewRuc] = useState<string>('');
  const [newRazonSocial, setNewRazonSocial] = useState<string>('');
  const [newNombreComercial, setNewNombreComercial] = useState<string>('');
  const [newSlug, setNewSlug] = useState<string>('');
  const [newRubro, setNewRubro] = useState<string>('Dispositivos Médicos & Farmacia');
  const [newKeywords, setNewKeywords] = useState<string>('MEDICO, HOSPITALARIO, TOMOGRAFO, REACTIVOS');
  const [newWhatsapp, setNewWhatsapp] = useState<string>('');
  const [newPlan, setNewPlan] = useState<string>('PILOTO_FUNDADOR');
  const [sendWelcome, setSendWelcome] = useState<boolean>(true);
  const [seedDemo, setSeedDemo] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formFeedback, setFormFeedback] = useState<{ success: boolean; message: string } | null>(null);

  // Quick test alert state
  const [testPhoneModal, setTestPhoneModal] = useState<{ isOpen: boolean; tenantName: string; phone: string }>({
    isOpen: false,
    tenantName: '',
    phone: '',
  });
  const [isSendingTest, setIsSendingTest] = useState<boolean>(false);
  const [testFeedback, setTestFeedback] = useState<string>('');

  // 1. Verificar sesión existente al montar
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    setIsCheckingAuth(true);
    try {
      const res = await fetch('/api/admin/auth');
      const data = await res.json();
      if (data.authenticated) {
        setIsAuthenticated(true);
        fetchData();
      }
    } catch {
      setIsAuthenticated(false);
    } finally {
      setIsCheckingAuth(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: adminKeyInput }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthenticated(true);
        fetchData();
      } else {
        setAuthError(data.error || 'Clave de acceso inválida.');
      }
    } catch (err: any) {
      setAuthError('Error de red al intentar acceder.');
    }
  };

  const handleLogout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    setIsAuthenticated(false);
  };

  // 2. Cargar datos de Tenants y Queue
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [tenantsRes, queueRes] = await Promise.all([
        fetch('/api/admin/tenants'),
        fetch('/api/admin/queue'),
      ]);

      if (tenantsRes.ok) {
        const tenantsData = await tenantsRes.json();
        setTenants(tenantsData.tenants || []);
      }
      if (queueRes.ok) {
        const queueData = await queueRes.json();
        setQueue(queueData.queue || []);
      }
    } catch (err: any) {
      console.error('Error fetching admin data:', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Auto-generar Slug al escribir Razón Social
  const handleRazonSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setNewRazonSocial(val);
    if (!newSlug || newSlug === autoSlugify(newRazonSocial)) {
      setNewSlug(autoSlugify(val));
    }
  };

  const autoSlugify = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  // 4. Aprovisionar nuevo cliente
  const handleCreateTenant = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormFeedback(null);

    try {
      const res = await fetch('/api/admin/tenants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ruc: newRuc,
          razon_social: newRazonSocial,
          nombre_comercial: newNombreComercial || newRazonSocial,
          slug: newSlug,
          rubro: newRubro,
          palabras_clave: newKeywords,
          whatsapp_destino: newWhatsapp,
          plan: newPlan,
          enviar_bienvenida: sendWelcome,
          sembrar_demo: seedDemo,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setFormFeedback({
          success: true,
          message: `¡Cliente "${newRazonSocial}" aprovisionado con éxito! Portal: ${data.portalUrl}`,
        });
        // Reset form
        setNewRuc('');
        setNewRazonSocial('');
        setNewNombreComercial('');
        setNewSlug('');
        setNewWhatsapp('');
        fetchData();
        setTimeout(() => setActiveTab('tenants'), 2000);
      } else {
        setFormFeedback({
          success: false,
          message: data.error || 'Error al aprovisionar el cliente.',
        });
      }
    } catch (err: any) {
      setFormFeedback({ success: false, message: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  // 5. Alternar estado activo de un tenant
  const handleToggleActive = async (tenant: TenantItem) => {
    const newStatus = !tenant.alertas_activas;
    try {
      const res = await fetch(`/api/admin/tenants/${tenant.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alertas_activas: newStatus }),
      });
      if (res.ok) {
        setTenants((prev) =>
          prev.map((t) => (t.id === tenant.id ? { ...t, alertas_activas: newStatus } : t))
        );
      }
    } catch (err: any) {
      console.error('Error toggling tenant status:', err);
    }
  };

  // 6. Eliminar tenant
  const handleDeleteTenant = async (tenant: TenantItem) => {
    if (!confirm(`¿Estás seguro de eliminar permanentemente a "${tenant.razon_social}" (RUC ${tenant.ruc})? Esta acción borrará todas sus auditorías asociadas.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/tenants/${tenant.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setTenants((prev) => prev.filter((t) => t.id !== tenant.id));
      }
    } catch (err: any) {
      alert('Error eliminando tenant: ' + err.message);
    }
  };

  // 7. Disparar prueba de WhatsApp
  const handleSendTestAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSendingTest(true);
    setTestFeedback('');

    try {
      const res = await fetch('/api/admin/queue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          telefono: testPhoneModal.phone,
          tenant_name: testPhoneModal.tenantName,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setTestFeedback(`✅ Alerta encolada con éxito. Railway la entregará en ~3s.`);
        setTimeout(() => {
          setTestPhoneModal({ isOpen: false, tenantName: '', phone: '' });
          fetchData();
        }, 2500);
      } else {
        setTestFeedback(`❌ ${data.error || 'Error al encolar alerta.'}`);
      }
    } catch (err: any) {
      setTestFeedback('Error de red al enviar.');
    } finally {
      setIsSendingTest(false);
    }
  };

  // Formato PEN
  const formatPEN = (amount: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Cálculos globales
  const totalTenantsCount = tenants.length;
  const activeTenantsCount = tenants.filter((t) => t.alertas_activas).length;
  const totalPipelinePEN = tenants.reduce((acc, curr) => acc + (curr.stats?.pipeline_pen || 0), 0);
  const totalLicitacionesCount = tenants.reduce((acc, curr) => acc + (curr.stats?.total_licitaciones || 0), 0);

  // Filtrado
  const filteredTenants = tenants.filter(
    (t) =>
      t.razon_social.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.ruc.includes(searchQuery) ||
      t.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.palabras_clave || []).some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Pantalla de carga inicial
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-[#030407] flex items-center justify-center text-slate-400 font-mono text-sm">
        <RefreshCw className="w-5 h-5 animate-spin text-[#D4AF37] mr-3" />
        Verificando credenciales ejecutivas...
      </div>
    );
  }

  // Compuerta de Acceso (Auth Gate)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#030407] flex flex-col items-center justify-center p-4 selection:bg-[#D4AF37]/20 selection:text-[#F3E5AB]">
        <div className="max-w-md w-full card-luxury rounded-2xl p-8 border border-[#D4AF37]/30 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 rounded-full blur-3xl" />

          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F3E5AB] via-[#D4AF37] to-[#997A15] flex items-center justify-center font-serif font-bold text-black text-xl shadow-lg">
              Q
            </div>
            <div>
              <h1 className="font-serif text-lg font-medium text-white tracking-tight">
                SUPERADMIN <span className="text-gold-gradient">CONSOLE</span>
              </h1>
              <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400">
                The Quant Partners • Internal Operations
              </p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2">
                Clave Maestra de Administrador
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                  <KeyRound className="w-4 h-4 text-[#D4AF37]" />
                </span>
                <input
                  type="password"
                  value={adminKeyInput}
                  onChange={(e) => setAdminKeyInput(e.target.value)}
                  placeholder="Ingrese clave de acceso"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-[#030407] border border-white/10 rounded-xl text-sm font-mono text-white placeholder-slate-600 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
                />
              </div>
            </div>

            {authError && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-mono flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              className="btn-primary w-full py-3 text-xs tracking-wider uppercase font-mono font-semibold"
            >
              Ingresar al Centro de Mando
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-white/[0.06] text-center">
            <Link href="/" className="text-[11px] font-mono text-slate-500 hover:text-slate-300 transition-colors">
              ← Regresar al portal principal
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Panel Principal de Superadmin
  return (
    <div className="min-h-screen bg-[#030407] text-slate-100 flex flex-col selection:bg-[#D4AF37]/20 selection:text-[#F3E5AB]">
      {/* Top Header */}
      <header className="border-b border-white/[0.06] bg-[#030407]/90 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#F3E5AB] via-[#D4AF37] to-[#997A15] flex items-center justify-center font-serif font-bold text-black text-lg shadow-lg">
                Q
              </div>
              <div>
                <span className="font-serif text-lg font-medium text-white tracking-tight block leading-none">
                  SUPERADMIN <span className="text-gold-gradient">CONSOLE</span>
                </span>
                <span className="font-mono text-[9px] uppercase tracking-widest text-[#D4AF37] block mt-1">
                  Cluster Orchestration • B2B SaaR
                </span>
              </div>
            </Link>

            <div className="hidden md:block h-6 w-px bg-white/10 mx-2" />

            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Railway Daemon 24/7 Activo</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchData}
              disabled={isLoading}
              className="p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] text-slate-300 hover:text-white transition-all text-xs flex items-center gap-2 font-mono"
              title="Refrescar datos"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#D4AF37]' : ''}`} />
              <span className="hidden sm:inline">Actualizar</span>
            </button>

            <button
              onClick={handleLogout}
              className="p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:bg-rose-500/20 hover:border-rose-500/30 text-slate-400 hover:text-rose-300 transition-all text-xs flex items-center gap-1.5 font-mono"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        {/* 4 Bento Cards de KPIs Globales */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* KPI 1: Empresas Activas */}
          <div className="card-luxury rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400">
                  Tenants Vigilados
                </span>
                <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37]">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="font-mono text-3xl font-semibold text-white tracking-tight">
                {activeTenantsCount} <span className="text-sm font-normal text-slate-400">/ {totalTenantsCount}</span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-white/[0.05] text-[11px] font-mono text-emerald-400 flex items-center justify-between">
              <span>{activeTenantsCount} enviando alertas</span>
              <span className="text-slate-400">{totalTenantsCount - activeTenantsCount} pausados</span>
            </div>
          </div>

          {/* KPI 2: Pipeline Global Acumulado */}
          <div className="card-luxury rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400">
                  Pipeline Global en Radar
                </span>
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <div className="font-mono text-3xl font-semibold text-white tracking-tight">
                {formatPEN(totalPipelinePEN)}
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-white/[0.05] text-[11px] font-mono text-slate-400 flex items-center justify-between">
              <span>Valor referencial auditado</span>
              <span className="text-[#D4AF37]">SEACE 3.0</span>
            </div>
          </div>

          {/* KPI 3: Licitaciones Auditadas */}
          <div className="card-luxury rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400">
                  Expedientes en Base de Datos
                </span>
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-sky-400">
                  <FileText className="w-4 h-4" />
                </div>
              </div>
              <div className="font-mono text-3xl font-semibold text-white tracking-tight">
                {totalLicitacionesCount} <span className="text-sm font-normal text-slate-400">auditorías</span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-white/[0.05] text-[11px] font-mono text-slate-400 flex items-center justify-between">
              <span>Gemini Multimodal 2.5</span>
              <span className="text-sky-400">PDFs en Supabase</span>
            </div>
          </div>

          {/* KPI 4: Cola de Alertas */}
          <div className="card-luxury rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400">
                  Cola de Despacho Railway
                </span>
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-[#F3E5AB]">
                  <Activity className="w-4 h-4" />
                </div>
              </div>
              <div className="font-mono text-3xl font-semibold text-white tracking-tight">
                {queue.length} <span className="text-sm font-normal text-slate-400">registros</span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-white/[0.05] text-[11px] font-mono text-slate-400 flex items-center justify-between">
              <span className="text-emerald-400">{queue.filter((q) => q.estado === 'ENVIADO').length} entregados</span>
              <span className="text-amber-400">{queue.filter((q) => q.estado === 'PENDIENTE').length} pendientes</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('tenants')}
              className={`px-4 py-2.5 rounded-xl font-mono text-xs transition-all flex items-center gap-2 ${
                activeTab === 'tenants'
                  ? 'bg-[#D4AF37] text-black font-semibold shadow-lg shadow-[#D4AF37]/20'
                  : 'bg-white/[0.04] text-slate-400 hover:text-white border border-white/[0.06]'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Clientes Vigilados ({tenants.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('create')}
              className={`px-4 py-2.5 rounded-xl font-mono text-xs transition-all flex items-center gap-2 ${
                activeTab === 'create'
                  ? 'bg-[#D4AF37] text-black font-semibold shadow-lg shadow-[#D4AF37]/20'
                  : 'bg-white/[0.04] text-slate-400 hover:text-white border border-white/[0.06]'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>+ Aprovisionar Nuevo Cliente</span>
            </button>

            <button
              onClick={() => setActiveTab('queue')}
              className={`px-4 py-2.5 rounded-xl font-mono text-xs transition-all flex items-center gap-2 ${
                activeTab === 'queue'
                  ? 'bg-[#D4AF37] text-black font-semibold shadow-lg shadow-[#D4AF37]/20'
                  : 'bg-white/[0.04] text-slate-400 hover:text-white border border-white/[0.06]'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Monitor de Cola WhatsApp</span>
            </button>
          </div>

          {activeTab === 'tenants' && (
            <div className="relative w-64 hidden sm:block">
              <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filtrar por RUC o Razón Social..."
                className="w-full pl-9 pr-3 py-2 bg-[#030407] border border-white/10 rounded-xl text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          )}
        </div>

        {/* TAB 1: LISTADO DE TENANTS */}
        {activeTab === 'tenants' && (
          <div className="card-luxury rounded-2xl p-6 border border-white/[0.08] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-xl font-medium text-white tracking-tight">
                  Directorio de Empresas Conectadas
                </h2>
                <p className="text-xs text-slate-400 font-light mt-0.5">
                  Cada cliente cuenta con un portal aislado y monitoreo automático según sus palabras clave.
                </p>
              </div>
            </div>

            {filteredTenants.length === 0 ? (
              <div className="text-center py-12 text-slate-500 font-mono text-xs">
                No se encontraron tenants registrados.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-white/[0.08] text-[10px] uppercase tracking-wider text-slate-400">
                      <th className="py-3 px-3">Empresa / Razón Social</th>
                      <th className="py-3 px-3">RUC</th>
                      <th className="py-3 px-3">Portal Looker</th>
                      <th className="py-3 px-3">WhatsApp Receptor</th>
                      <th className="py-3 px-3">Radar SEACE</th>
                      <th className="py-3 px-3">Plan</th>
                      <th className="py-3 px-3 text-center">Alertas</th>
                      <th className="py-3 px-3 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.05]">
                    {filteredTenants.map((t) => (
                      <tr key={t.id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="py-3.5 px-3">
                          <div className="font-medium text-white">{t.razon_social}</div>
                          {t.nombre_comercial && t.nombre_comercial !== t.razon_social && (
                            <div className="text-[11px] text-slate-400 font-light">{t.nombre_comercial}</div>
                          )}
                        </td>

                        <td className="py-3.5 px-3">
                          <span className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.06] text-slate-300">
                            {t.ruc}
                          </span>
                        </td>

                        <td className="py-3.5 px-3">
                          <Link
                            href={`/portal/${t.slug}`}
                            target="_blank"
                            className="text-[#D4AF37] hover:underline flex items-center gap-1.5"
                          >
                            <span>/portal/{t.slug}</span>
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        </td>

                        <td className="py-3.5 px-3">
                          {t.whatsapp_destino ? (
                            <span className="text-emerald-400 flex items-center gap-1">
                              <Smartphone className="w-3 h-3" />
                              +{t.whatsapp_destino}
                            </span>
                          ) : (
                            <span className="text-slate-500 italic">Sin configurar</span>
                          )}
                        </td>

                        <td className="py-3.5 px-3 max-w-[200px]">
                          <div className="flex flex-wrap gap-1">
                            {(t.palabras_clave || []).slice(0, 3).map((k, idx) => (
                              <span
                                key={idx}
                                className="px-1.5 py-0.5 rounded bg-[#D4AF37]/10 text-[#F3E5AB] text-[9px] border border-[#D4AF37]/20"
                              >
                                {k}
                              </span>
                            ))}
                            {(t.palabras_clave || []).length > 3 && (
                              <span className="text-[9px] text-slate-400 self-center">
                                +{(t.palabras_clave || []).length - 3}
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="py-3.5 px-3">
                          <span className="text-[10px] text-slate-300 px-2 py-0.5 rounded bg-white/[0.04]">
                            {t.plan}
                          </span>
                        </td>

                        <td className="py-3.5 px-3 text-center">
                          <button
                            onClick={() => handleToggleActive(t)}
                            className={`px-2 py-1 rounded text-[10px] font-semibold transition-all ${
                              t.alertas_activas
                                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                : 'bg-slate-700/30 text-slate-400 border border-slate-700'
                            }`}
                          >
                            {t.alertas_activas ? 'VIGILANDO' : 'PAUSADO'}
                          </button>
                        </td>

                        <td className="py-3.5 px-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() =>
                                setTestPhoneModal({
                                  isOpen: true,
                                  tenantName: t.razon_social,
                                  phone: t.whatsapp_destino || '',
                                })
                              }
                              title="Disparar alerta pericial de prueba vía Railway"
                              className="p-1.5 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all"
                            >
                              <Send className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => handleDeleteTenant(t)}
                              title="Eliminar tenant"
                              className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white transition-all"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: APROVISIONAR NUEVO CLIENTE */}
        {activeTab === 'create' && (
          <div className="max-w-2xl mx-auto card-luxury rounded-2xl p-6 sm:p-8 border border-[#D4AF37]/25 relative overflow-hidden">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
                <PlusCircle className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif text-xl font-medium text-white tracking-tight">
                  Aprovisionamiento de Nuevo Cliente B2B
                </h2>
                <p className="text-xs text-slate-400 font-light mt-0.5 font-mono">
                  Genera el espacio multi-tenant, portal Looker y radar de SEACE en menos de 1 minuto.
                </p>
              </div>
            </div>

            <form onSubmit={handleCreateTenant} className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase tracking-wider text-slate-300 mb-1">
                    RUC SUNAT (11 Dígitos) *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={11}
                    value={newRuc}
                    onChange={(e) => setNewRuc(e.target.value.replace(/\D/g, ''))}
                    placeholder="Ej. 20601234567"
                    className="w-full px-3.5 py-2.5 bg-[#030407] border border-white/10 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-slate-300 mb-1">
                    Plan Comercial
                  </label>
                  <select
                    value={newPlan}
                    onChange={(e) => setNewPlan(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#030407] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="PILOTO_FUNDADOR">Piloto Fundador (S/. 1,500/mes)</option>
                    <option value="ESTANDAR">Estándar (S/. 2,500/mes)</option>
                    <option value="ENTERPRISE">Enterprise White-Glove (S/. 5,000/mes)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block uppercase tracking-wider text-slate-300 mb-1">
                  Razón Social Completa *
                </label>
                <input
                  type="text"
                  required
                  value={newRazonSocial}
                  onChange={handleRazonSocialChange}
                  placeholder="Ej. BIOMÉDICA & TECNOLOGÍA PERUANA S.A.C."
                  className="w-full px-3.5 py-2.5 bg-[#030407] border border-white/10 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase tracking-wider text-slate-300 mb-1">
                    Nombre Comercial (Opcional)
                  </label>
                  <input
                    type="text"
                    value={newNombreComercial}
                    onChange={(e) => setNewNombreComercial(e.target.value)}
                    placeholder="Ej. Biomedica Perú"
                    className="w-full px-3.5 py-2.5 bg-[#030407] border border-white/10 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-slate-300 mb-1">
                    Slug para la URL del Portal *
                  </label>
                  <input
                    type="text"
                    required
                    value={newSlug}
                    onChange={(e) => setNewSlug(autoSlugify(e.target.value))}
                    placeholder="biomedica-peru"
                    className="w-full px-3.5 py-2.5 bg-[#030407] border border-white/10 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-[#D4AF37]"
                  />
                  {newSlug && (
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      URL: https://licitaciones.thequantpartners.com/portal/{newSlug}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label className="block uppercase tracking-wider text-slate-300 mb-1">
                  WhatsApp Receptor de Gerencia (9 dígitos)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    🇵🇪 +51
                  </span>
                  <input
                    type="text"
                    maxLength={9}
                    value={newWhatsapp}
                    onChange={(e) => setNewWhatsapp(e.target.value.replace(/\D/g, ''))}
                    placeholder="987654321"
                    className="w-full pl-16 pr-3.5 py-2.5 bg-[#030407] border border-white/10 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div>
                <label className="block uppercase tracking-wider text-slate-300 mb-1">
                  Palabras Clave para Radar SEACE (Separadas por comas)
                </label>
                <input
                  type="text"
                  value={newKeywords}
                  onChange={(e) => setNewKeywords(e.target.value)}
                  placeholder="MEDICO, HOSPITALARIO, TOMOGRAFO, REACTIVOS"
                  className="w-full px-3.5 py-2.5 bg-[#030407] border border-white/10 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              {/* Switches de automatización */}
              <div className="pt-2 border-t border-white/[0.06] space-y-2.5">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={seedDemo}
                    onChange={(e) => setSeedDemo(e.target.checked)}
                    className="w-4 h-4 rounded bg-[#030407] border border-white/20 text-[#D4AF37] accent-[#D4AF37]"
                  />
                  <span className="text-slate-300 text-[11px]">
                    Sembrar auditoría inicial de muestra (EsSalud Piura S/. 2.85M) para poblar portal Looker
                  </span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sendWelcome}
                    onChange={(e) => setSendWelcome(e.target.checked)}
                    className="w-4 h-4 rounded bg-[#030407] border border-white/20 text-[#D4AF37] accent-[#D4AF37]"
                  />
                  <span className="text-slate-300 text-[11px]">
                    Disparar mensaje de bienvenida con enlace al portal de inmediato por WhatsApp
                  </span>
                </label>
              </div>

              {formFeedback && (
                <div
                  className={`p-3.5 rounded-xl border text-xs font-mono flex items-start gap-2.5 ${
                    formFeedback.success
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                      : 'bg-rose-500/10 border-rose-500/20 text-rose-300'
                  }`}
                >
                  {formFeedback.success ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                  )}
                  <span>{formFeedback.message}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full py-3.5 text-xs uppercase tracking-wider font-semibold font-mono"
              >
                {isSubmitting ? (
                  <RefreshCw className="w-4 h-4 animate-spin mx-auto" />
                ) : (
                  '✨ Aprovisionar & Activar Cliente'
                )}
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: MONITOR DE COLA RAILWAY */}
        {activeTab === 'queue' && (
          <div className="card-luxury rounded-2xl p-6 border border-white/[0.08] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-xl font-medium text-white tracking-tight">
                  Cola de Despachos Asíncronos (Railway Worker)
                </h2>
                <p className="text-xs text-slate-400 font-light mt-0.5 font-mono">
                  Eventos encolados en Supabase y procesados por el socket Baileys en la nube.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Polling cada 3 segundos</span>
              </div>
            </div>

            {queue.length === 0 ? (
              <div className="text-center py-12 text-slate-500 font-mono text-xs">
                No hay alertas encoladas recientemente.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-white/[0.08] text-[10px] uppercase tracking-wider text-slate-400">
                      <th className="py-3 px-3">Estado</th>
                      <th className="py-3 px-3">Destinatario</th>
                      <th className="py-3 px-3">Tipo</th>
                      <th className="py-3 px-3">Fecha Solicitud</th>
                      <th className="py-3 px-3">Fecha Envío</th>
                      <th className="py-3 px-3">PDF Adjunto</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.05]">
                    {queue.map((item) => (
                      <tr key={item.id} className="hover:bg-white/[0.02]">
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                              item.estado === 'ENVIADO'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : item.estado === 'PENDIENTE'
                                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse'
                                : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            }`}
                          >
                            {item.estado}
                          </span>
                        </td>

                        <td className="py-3 px-3 font-medium text-white">
                          +{item.telefono}
                        </td>

                        <td className="py-3 px-3 text-slate-400">
                          {item.tipo}
                        </td>

                        <td className="py-3 px-3 text-slate-500">
                          {new Date(item.created_at).toLocaleTimeString('es-PE')} (
                          {new Date(item.created_at).toLocaleDateString('es-PE')})
                        </td>

                        <td className="py-3 px-3 text-slate-400">
                          {item.sent_at
                            ? new Date(item.sent_at).toLocaleTimeString('es-PE')
                            : '—'}
                        </td>

                        <td className="py-3 px-3">
                          {item.pdf_url ? (
                            <Link
                              href={item.pdf_url}
                              target="_blank"
                              className="text-[#D4AF37] hover:underline flex items-center gap-1"
                            >
                              <span>Ver PDF</span>
                              <ExternalLink className="w-3 h-3" />
                            </Link>
                          ) : (
                            '—'
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modal para Disparar Alerta Test */}
      {testPhoneModal.isOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full card-luxury rounded-2xl p-6 border border-[#D4AF37]/30 relative">
            <button
              onClick={() => setTestPhoneModal({ isOpen: false, tenantName: '', phone: '' })}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif text-lg font-medium text-white mb-1">
              Disparar Alerta Pericial de Prueba
            </h3>
            <p className="text-xs text-slate-400 font-mono mb-4">
              Cliente: {testPhoneModal.tenantName}
            </p>

            <form onSubmit={handleSendTestAlert} className="space-y-4 font-mono text-xs">
              <div>
                <label className="block text-slate-300 uppercase mb-1">
                  Número Celular Destino
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    🇵🇪 +51
                  </span>
                  <input
                    type="text"
                    required
                    maxLength={9}
                    value={testPhoneModal.phone.replace(/^51/, '')}
                    onChange={(e) =>
                      setTestPhoneModal((prev) => ({
                        ...prev,
                        phone: e.target.value.replace(/\D/g, ''),
                      }))
                    }
                    placeholder="987654321"
                    className="w-full pl-16 pr-3 py-2.5 bg-[#030407] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              {testFeedback && (
                <div className="p-3 rounded-lg bg-white/[0.04] border border-white/10 text-xs">
                  {testFeedback}
                </div>
              )}

              <button
                type="submit"
                disabled={isSendingTest}
                className="btn-primary w-full py-2.5 uppercase font-semibold"
              >
                {isSendingTest ? (
                  <RefreshCw className="w-4 h-4 animate-spin mx-auto" />
                ) : (
                  '🚀 Despachar Vía Railway'
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
