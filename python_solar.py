from pymodbus.client.sync import ModbusSerialClient as ModbusClient

client = ModbusClient(method='rtu', port='/dev/ttyUSB0', timeout=1, stopbits = 1, bytesize = 8,  parity='N', baudrate= 115200)
client.connect()
request = client.read_input_registers(0x3304,1,unit=1)
print request.registers
