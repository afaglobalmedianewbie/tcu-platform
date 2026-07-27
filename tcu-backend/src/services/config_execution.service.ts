import { ConfigExecution, ConfigRollback, ConfigTemplate } from '../models/config_template.model';

export class ConfigExecutionService {
  
  /**
   * Orchestrate Execution of a template payload onto a target device
   */
  async executeConfig(template: ConfigTemplate, targetId: string) {
    console.log(`[ConfigEngine] Initiating execution of Template: ${template.name} on Target: ${targetId}`);
    
    const execution: ConfigExecution = {
      id: `EXEC-${Date.now()}`,
      templateId: template.id,
      targetId,
      status: 'VALIDATING',
      executionLogs: ['Validating template syntax and target compatibility...'],
      executedAt: new Date()
    };

    try {
      // 1. Dependency Resolution & Validation
      await new Promise(res => setTimeout(res, 500));
      execution.status = 'EXECUTING';
      execution.executionLogs.push('Validation passed. Generating CLI/SNMP/ACS payload sequences...');

      // 2. Snapshot Previous Config (For Rollback)
      const previousSnapshot = `{"simulated_previous_state": "v1"}`; 
      console.log(`[ConfigEngine] Target state snapshot saved for rollback.`);

      // 3. Simulated Execution via Protocols
      console.log(`[ConfigEngine] Deploying payload: ${template.payload}`);
      
      // Deliberately simulate failure to test rollback logic if payload contains error flag
      if (template.payload.includes('ERROR_TRIGGER')) {
        throw new Error('Device rejected payload due to syntax error.');
      }

      execution.status = 'SUCCESS';
      execution.executionLogs.push('Execution completed successfully.');
      console.log(`[ConfigEngine] Deploy SUCCESS.`);
      
    } catch (error: any) {
      execution.status = 'FAILED';
      execution.executionLogs.push(`Execution FAILED: ${error.message}`);
      console.log(`[ConfigEngine] Deploy FAILED: ${error.message}`);
      
      // Auto Rollback
      await this.triggerRollback(execution.id, targetId, '{"simulated_previous_state": "v1"}');
      execution.status = 'ROLLED_BACK';
    }

    return execution;
  }

  /**
   * Rollback configuration to a previous state
   */
  async triggerRollback(executionId: string, targetId: string, previousPayload: string) {
    console.log(`[ConfigEngine] 🚨 INITIATING AUTO-ROLLBACK for Target: ${targetId}`);
    
    const rollback: ConfigRollback = {
      id: `RB-${Date.now()}`,
      executionId,
      targetId,
      previousPayloadSnapshot: previousPayload,
      status: 'PENDING',
      executedAt: new Date()
    };

    try {
      // Restore via CLI/SNMP
      console.log(`[ConfigEngine] Restoring previous configuration snapshot...`);
      rollback.status = 'SUCCESS';
      console.log(`[ConfigEngine] Rollback SUCCESSFUL.`);
    } catch (err) {
      rollback.status = 'FAILED';
      console.log(`[ConfigEngine] Rollback FAILED! Intervention required.`);
    }

    return rollback;
  }
}
