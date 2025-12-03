// app/admin-ingestion/components/SecretsManager.tsx

"use client";

import { useState } from 'react';
import { mockApiSecrets } from '@/lib/admin-ingestion-mock-data';
import { ApiSecret } from '@/types/admin-ingestion';

export default function SecretsManager() {
  const [secrets, setSecrets] = useState<ApiSecret[]>(mockApiSecrets);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSecret, setShowSecret] = useState<string | null>(null);
  const [newSecret, setNewSecret] = useState({
    name: '',
    service: '',
    key: '',
    permissions: [] as string[]
  });

  const handleAddSecret = () => {
    const secret: ApiSecret = {
      id: `secret-${Date.now()}`,
      name: newSecret.name,
      service: newSecret.service,
      createdAt: new Date(),
      lastUsed: null,
      status: 'active',
      permissions: newSecret.permissions,
      masked: `${newSecret.key.slice(0, 3)}...${newSecret.key.slice(-6)}`
    };

    setSecrets([secret, ...secrets]);
    setShowAddModal(false);
    setNewSecret({ name: '', service: '', key: '', permissions: [] });
  };

  const handleRevoke = (secretId: string) => {
    setSecrets(secrets.map(s => 
      s.id === secretId ? { ...s, status: 'revoked' as const } : s
    ));
  };

  const handleRotate = (secretId: string) => {
    // Simulate key rotation
    console.log('Rotating key:', secretId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'expired': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'revoked': return 'bg-red-500/20 text-red-400 border-red-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const availablePermissions = [
    'read', 'write', 'search', 'embeddings', 'completions', 'admin'
  ];

  return (
    <div className="space-y-6">
      {/* API Keys */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-white">API Keys & Secrets</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Manage API keys and authentication credentials
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <span>🔑</span>
            Add API Key
          </button>
        </div>

        <div className="space-y-3">
          {secrets.map((secret) => (
            <div key={secret.id} className="bg-background border border-border rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-medium text-white">{secret.name}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(secret.status)}`}>
                      {secret.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Service</p>
                      <p className="text-sm text-white">{secret.service}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Created</p>
                      <p className="text-sm text-white">{secret.createdAt.toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Last Used</p>
                      <p className="text-sm text-white">
                        {secret.lastUsed ? secret.lastUsed.toLocaleDateString() : 'Never'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Expires</p>
                      <p className="text-sm text-white">
                        {secret.expiresAt ? secret.expiresAt.toLocaleDateString() : 'Never'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Key:</span>
                      <code className="px-2 py-1 bg-card rounded text-xs text-white font-mono">
                        {showSecret === secret.id ? 'sk-1234567890abcdef1234567890abcdef' : secret.masked}
                      </code>
                      <button
                        onClick={() => setShowSecret(showSecret === secret.id ? null : secret.id)}
                        className="p-1 text-muted-foreground hover:text-white transition-colors"
                      >
                        {showSecret === secret.id ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                      <button className="p-1 text-muted-foreground hover:text-white transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Permissions:</span>
                    <div className="flex gap-1">
                      {secret.permissions.map((perm) => (
                        <span key={perm} className="px-2 py-0.5 bg-card rounded text-xs text-white">
                          {perm}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => handleRotate(secret.id)}
                    className="p-2 text-blue-400 hover:text-blue-300 transition-colors"
                    title="Rotate Key"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                  {secret.status === 'active' && (
                    <button
                      onClick={() => handleRevoke(secret.id)}
                      className="p-2 text-red-400 hover:text-red-300 transition-colors"
                      title="Revoke Key"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              {secret.expiresAt && secret.expiresAt < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) && (
                <div className="mt-3 p-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <p className="text-xs text-yellow-400">
                    ⚠️ This key expires in {Math.ceil((secret.expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Security Notice */}
        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <div className="flex gap-3">
            <span className="text-2xl">🔐</span>
            <div>
              <p className="text-sm font-medium text-blue-400 mb-1">Security Best Practices</p>
              <ul className="text-xs text-blue-300 space-y-1">
                <li>• Rotate API keys regularly (every 90 days recommended)</li>
                <li>• Use minimal required permissions for each key</li>
                <li>• Monitor key usage for unusual patterns</li>
                <li>• Never share keys in code repositories or logs</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Add API Key Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-white mb-4">Add API Key</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Key Name</label>
                <input
                  type="text"
                  value={newSecret.name}
                  onChange={(e) => setNewSecret({ ...newSecret, name: e.target.value })}
                  placeholder="e.g., Production USPTO API"
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-2">Service</label>
                <input
                  type="text"
                  value={newSecret.service}
                  onChange={(e) => setNewSecret({ ...newSecret, service: e.target.value })}
                  placeholder="e.g., USPTO, OpenAI, Crunchbase"
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-2">API Key</label>
                <input
                  type="password"
                  value={newSecret.key}
                  onChange={(e) => setNewSecret({ ...newSecret, key: e.target.value })}
                  placeholder="Enter your API key"
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-2">Permissions</label>
                <div className="grid grid-cols-2 gap-2">
                  {availablePermissions.map((perm) => (
                    <label key={perm} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={newSecret.permissions.includes(perm)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewSecret({ ...newSecret, permissions: [...newSecret.permissions, perm] });
                          } else {
                            setNewSecret({ ...newSecret, permissions: newSecret.permissions.filter(p => p !== perm) });
                          }
                        }}
                        className="w-4 h-4 bg-background border border-border rounded text-blue-500"
                      />
                      <span className="text-sm text-white">{perm}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 text-muted-foreground border border-border rounded-lg hover:bg-background transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSecret}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add API Key
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}