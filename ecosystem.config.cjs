module.exports = {
  apps: [{
    name: 'sistema-atividades',
    script: './dist/index.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    
    // Configurações de ambiente
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    
    // Configurações de logs
    log_type: 'json',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    out_file: './logs/out.log',
    error_file: './logs/error.log',
    log_file: './logs/combined.log',
    
    // Configurações de restart
    restart_delay: 1000,
    max_restarts: 10,
    min_uptime: '10s',
    
    // Configurações de cluster (se necessário)
    // instances: 'max',  // Para usar todos os CPUs
    // exec_mode: 'cluster',
    
    // Configurações de recursos
    kill_timeout: 5000,
    listen_timeout: 5000,
    
    // Configurações avançadas
    merge_logs: true,
    time: true,
    
    // Configurações de monitoramento
    pmx: true,
    
    // Configurações de source maps (para debugging)
    source_map_support: true,
    
    // Variáveis de ambiente específicas para diferentes stages
    env_development: {
      NODE_ENV: 'development',
      PORT: 5000,
      LOG_LEVEL: 'debug'
    },
    
    env_staging: {
      NODE_ENV: 'staging',
      PORT: 5000,
      LOG_LEVEL: 'info'
    },
    
    env_production: {
      NODE_ENV: 'production',
      PORT: 5000,
      LOG_LEVEL: 'error'
    }
  }],
  
  // Configurações de deploy (opcional)
  deploy: {
    production: {
      user: 'root',
      host: ['sua-vps-ip'],
      ref: 'origin/main',
      repo: 'https://github.com/seu-usuario/sistema-atividades.git',
      path: '/var/www/sistema-atividades',
      'post-deploy': 'npm ci --production=false && npm run build && pm2 reload ecosystem.config.cjs --env production',
      'pre-setup': 'apt update && apt install -y git nodejs npm'
    },
    
    staging: {
      user: 'root',
      host: ['staging-server-ip'],
      ref: 'origin/develop',
      repo: 'https://github.com/seu-usuario/sistema-atividades.git',
      path: '/var/www/sistema-atividades-staging',
      'post-deploy': 'npm ci && npm run build && pm2 reload ecosystem.config.cjs --env staging'
    }
  }
};