import { ConfigTemplate, ConfigType, ConfigVersion } from '../models/config_template.model';
import { ConfigExecutionService } from './config_execution.service';

export class ConfigService {
  private executionService = new ConfigExecutionService();
  private mockTemplates: ConfigTemplate[] = [
    {
      id: 'TPL-OLT-1',
      name: 'ZTE C320 Standard PON Profile',
      type: 'OLT',
      version: 1,
      payload: 'pon-onu-mng gpon-onu_{port}:{onu_id}\n tcont 1 name INTERNET profile UP_100M',
      description: 'Standard Internet T-CONT profile',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  async createTemplate(payload: Partial<ConfigTemplate>) {
    const tpl: ConfigTemplate = {
      id: `TPL-${Date.now()}`,
      name: payload.name!,
      type: payload.type as ConfigType,
      version: 1,
      payload: payload.payload!,
      description: payload.description || '',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.mockTemplates.push(tpl);
    return tpl;
  }

  async getTemplate(id: string) {
    return this.mockTemplates.find(t => t.id === id);
  }

  async listTemplates() {
    return this.mockTemplates;
  }

  async updateTemplate(id: string, newPayload: string) {
    const tpl = await this.getTemplate(id);
    if (!tpl) throw new Error('Template not found');

    // Simple diff simulator
    const diff = `+ ${newPayload}\n- ${tpl.payload}`;
    
    tpl.version += 1;
    tpl.payload = newPayload;
    tpl.updatedAt = new Date();

    const versionRecord: ConfigVersion = {
      id: `VER-${Date.now()}`,
      templateId: tpl.id,
      version: tpl.version,
      payload: newPayload,
      changesDiff: diff,
      createdAt: new Date()
    };

    console.log(`[Config] Template ${id} updated to version ${tpl.version}`);
    return { success: true, template: tpl, versionRecord };
  }

  async deleteTemplate(id: string) {
    return { success: true, message: `Template ${id} deleted` };
  }

  async applyTemplate(templateId: string, targetId: string) {
    const tpl = await this.getTemplate(templateId);
    if (!tpl) throw new Error('Template not found');
    
    return this.executionService.executeConfig(tpl, targetId);
  }

  // Device-specific Orchestration Wrappers
  async applyOltConfig(targetId: string, payload: any) {
    console.log(`[Config-Orchestration] Dispatching OLT configurations to ${targetId}`);
    return { success: true, targetId, message: 'OLT Configuration applied successfully' };
  }

  async applyOnuConfig(targetId: string, payload: any) {
    console.log(`[Config-Orchestration] Dispatching ONU configurations to ${targetId}`);
    return { success: true, targetId, message: 'ONU Configuration applied successfully' };
  }

  async applyRouterConfig(targetId: string, payload: any) {
    console.log(`[Config-Orchestration] Dispatching Router/ACS configurations to ${targetId}`);
    return { success: true, targetId, message: 'Router Configuration applied successfully' };
  }
}
