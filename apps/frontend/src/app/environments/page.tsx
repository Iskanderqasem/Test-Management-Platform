'use client';

import { useState, useEffect } from 'react';
import { Server, Database, Globe, Cpu, RefreshCw, CheckCircle2, AlertTriangle, XCircle, Activity } from 'lucide-react';

type ServiceStatus = 'healthy' | 'degraded' | 'down';

interface Service {
  name: string;
  type: string;
  url: string;
  status: ServiceStatus;
  responseTime: number;
  uptime: number;
  lastCheck: string;
}

const ENVIRONMENTS: { name: string; services: Service[] }[] = [
  {
    name: 'SIT',
    services: [
      { name: 'App Server', type: 'server', url: 'app-sit.internal', status: 'healthy', responseTime: 120, uptime: 99.8, lastCheck: '30s ago' },
      { name: 'IMS Core', type: 'api', url: 'ims-sit.internal:5060', status: 'healthy', responseTime: 45, uptime: 99.5, lastCheck: '30s ago' },
      { name: 'PostgreSQL', type: 'db', url: 'db-sit.internal:5432', status: 'healthy', responseTime: 8, uptime: 100, lastCheck: '30s ago' },
      { name: 'HSS', type: 'api', url: 'hss-sit.internal', status: 'degraded', responseTime: 890, uptime: 97.2, lastCheck: '30s ago' },
      { name: 'Redis Cache', type: 'cache', url: 'redis-sit.internal:6379', status: 'healthy', responseTime: 2, uptime: 100, lastCheck: '30s ago' },
    ],
  },
  {
    name: 'UAT',
    services: [
      { name: 'App Server', type: 'server', url: 'app-uat.internal', status: 'healthy', responseTime: 95, uptime: 99.9, lastCheck: '45s ago' },
      { name: 'IMS Core', type: 'api', url: 'ims-uat.internal:5060', status: 'down', responseTime: 0, uptime: 88.1, lastCheck: '45s ago' },
      { name: 'PostgreSQL', type: 'db', url: 'db-uat.internal:5432', status: 'healthy', responseTime: 12, uptime: 99.7, lastCheck: '45s ago' },
      { name: 'HSS', type: 'api', url: 'hss-uat.internal', status: 'healthy', responseTime: 230, uptime: 99.1, lastCheck: '45s ago' },
    ],
  },
  {
    name: 'Pre-PROD',
    services: [
      { name: 'App Server', type: 'server', url: 'app-preprod.internal', status: 'healthy', responseTime: 88, uptime: 100, lastCheck: '1m ago' },
      { name: 'IMS Core', type: 'api', url: 'ims-preprod.internal:5060', status: 'healthy', responseTime: 52, uptime: 99.9, lastCheck: '1m ago' },
      { name: 'PostgreSQL', type: 'db', url: 'db-preprod.internal:5432', status: 'healthy', responseTime: 9, uptime: 100, lastCheck: '1m ago' },
      { name: 'HSS', type: 'api', url: 'hss-preprod.internal', status: 'healthy', responseTime: 310, uptime: 99.4, lastCheck: '1m ago' },
    ],
  },
];

const statusConfig: Record<ServiceStatus, { icon: any; color: string; bg: string; label: string }> = {
  healthy: { icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50', label: 'Healthy' },
  degraded: { icon: AlertTriangle, color: 'text-yellow-600', bg: 'bg-yellow-50', label: 'Degraded' },
  down: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', label: 'Down' },
};

const typeIcon: Record<string, any> = { server: Server, api: Globe, db: Database, cache: Cpu };

export default function EnvironmentsPage() {
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const refresh = async () => {
    setRefreshing(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLastRefresh(new Date());
    setRefreshing(false);
  };

  useEffect(() => {
    const interval = setInterval(refresh, 30000);
    return () => clearInterval(interval);
  }, []);

  const allServices = ENVIRONMENTS.flatMap((e) => e.services);
  const healthy = allServices.filter((s) => s.status === 'healthy').length;
  const degraded = allServices.filter((s) => s.status === 'degraded').length;
  const down = allServices.filter((s) => s.status === 'down').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Environment Health Monitor</h1>
          <p className="text-gray-500 mt-1">Last updated: {lastRefresh.toLocaleTimeString()}</p>
        </div>
        <button onClick={refresh} disabled={refreshing} className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-60">
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      {/* Overview */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Healthy Services', value: healthy, icon: CheckCircle2, color: 'text-green-600 bg-green-50' },
          { label: 'Degraded Services', value: degraded, icon: AlertTriangle, color: 'text-yellow-600 bg-yellow-50' },
          { label: 'Down Services', value: down, icon: XCircle, color: 'text-red-600 bg-red-50' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex items-center gap-4">
            <div className={`p-3 rounded-lg ${color.split(' ')[1]}`}>
              <Icon className={`w-5 h-5 ${color.split(' ')[0]}`} />
            </div>
            <div>
              <p className="text-sm text-gray-500">{label}</p>
              <p className={`text-2xl font-bold ${color.split(' ')[0]}`}>{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Environment Grids */}
      <div className="space-y-4">
        {ENVIRONMENTS.map((env) => {
          const envHealthy = env.services.filter((s) => s.status === 'healthy').length;
          const envTotal = env.services.length;
          const envStatus: ServiceStatus = env.services.some((s) => s.status === 'down') ? 'down' : env.services.some((s) => s.status === 'degraded') ? 'degraded' : 'healthy';
          const { icon: EnvIcon, color: envColor } = statusConfig[envStatus];

          return (
            <div key={env.name} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                <div className="flex items-center gap-3">
                  <EnvIcon className={`w-5 h-5 ${envColor}`} />
                  <h3 className="font-semibold text-gray-800">{env.name} Environment</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusConfig[envStatus].bg} ${statusConfig[envStatus].color}`}>
                    {statusConfig[envStatus].label}
                  </span>
                </div>
                <span className="text-xs text-gray-500">{envHealthy}/{envTotal} services healthy</span>
              </div>
              <div className="p-5 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {env.services.map((svc) => {
                  const TypeIcon = typeIcon[svc.type] ?? Server;
                  const { icon: StatusIcon, color, bg } = statusConfig[svc.status];
                  return (
                    <div key={svc.name} className={`p-3 rounded-lg border ${svc.status === 'down' ? 'border-red-200 bg-red-50' : svc.status === 'degraded' ? 'border-yellow-200 bg-yellow-50' : 'border-gray-100 bg-gray-50'}`}>
                      <div className="flex items-start justify-between mb-2">
                        <TypeIcon className="w-4 h-4 text-gray-500" />
                        <StatusIcon className={`w-4 h-4 ${color}`} />
                      </div>
                      <p className="text-sm font-semibold text-gray-800">{svc.name}</p>
                      <p className="text-xs text-gray-400 truncate mb-2">{svc.url}</p>
                      <div className="space-y-0.5">
                        {svc.status !== 'down' && (
                          <div className="flex items-center gap-1">
                            <Activity className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-500">{svc.responseTime}ms</span>
                          </div>
                        )}
                        <p className="text-xs text-gray-400">Uptime: {svc.uptime}%</p>
                        <p className="text-xs text-gray-400">{svc.lastCheck}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
