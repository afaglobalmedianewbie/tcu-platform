export class CliService {
  /**
   * Generate SNMP setup commands for OLT
   */
  generateSnmpSetup(communityRo: string, communityRw: string) {
    return [
      `snmp-server community ${communityRo} ro`,
      `snmp-server community ${communityRw} rw`,
      `snmp-server enable trap`
    ].join('\\n');
  }

  /**
   * Generate configuration for ONU profiles (VLAN, GEM-Port, T-CONT)
   */
  generateOnuProfileConfig(profileName: string, vlanId: number) {
    return [
      `gpon onu profile tcont ${profileName} type 4 maximum 1024000`,
      `gpon onu profile traffic ${profileName} sir 1000000 pir 1000000`,
      `gpon onu profile vlan ${profileName} tag-mode tag vlan-id ${vlanId}`
    ].join('\\n');
  }

  /**
   * Generate NAT/Route script for MikroTik to route SNMP and Management over VPN
   * As per requirements: "no api no ssh no telnet", generated script is run manually by user.
   */
  generateMikrotikNatScript(oltIp: string, vpnIp: string) {
    return [
      `/ip route add dst-address=${oltIp}/32 gateway=${vpnIp}`,
      `/ip firewall nat add chain=srcnat dst-address=${oltIp} action=masquerade`,
      `/ip firewall filter add action=accept chain=forward dst-address=${oltIp}`
    ].join('\\n');
  }
}
