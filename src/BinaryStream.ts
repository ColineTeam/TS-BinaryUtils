//from: https://github.com/PocketNode/PocketNode-BinaryStream/blob/master/src/BinaryStream.js
class BinaryDataException extends Error{
    
}

class BinaryStream {
    public buffer: Buffer;
    public offset: number = 0;

    /**
     * @param buffer {Buffer|null}
     */
    constructor(buffer: Buffer|null = null){
        /** @type {Buffer} */
        this.buffer = Buffer.alloc(0);
        /** @type {number} */
        this.offset = 0;

        if(buffer instanceof Buffer){
            this.append(buffer);
            this.offset = 0;
        }
    }

    /*
     *******************************
     * Stream Management Functions *
     *******************************
    */

    /**
     * Read a set of bytes from the buffer
     * @param len {number}
     * @return {Buffer}
     */
    get(len: number){
        return this.buffer.slice(this.offset, this.increaseOffset(len, true));
    }

    /**
     * Reset the buffer
     */
    reset(){
        this.buffer = Buffer.alloc(0);
        this.offset = 0;
    }

    /**
     * Set the buffer and/or offset
     * @param buffer {Buffer}
     * @param offset {number}
     */
    setBuffer(buffer = Buffer.alloc(0), offset = 0){
        this.buffer = buffer;
        this.offset = offset;
    }

    /**
     * Increase the stream's offset
     * @param v   {number}
     * @param ret {boolean}
     * @return {number}
     */
    increaseOffset(v:number, ret:boolean = false){
        return (ret === true ? (this.offset += v) : (this.offset += v) - v);
    }

    /**
     * Append data to stream's buffer
     * @param buf {*}
     * @return {BinaryStream}
     */
    append(buf: any){
        if(buf instanceof Buffer){
            this.buffer = Buffer.concat([this.buffer, buf]);
            this.offset += buf.length;
        }else if(typeof buf === "string"){
            buf = Buffer.from(buf, "hex");
            this.buffer = Buffer.concat([this.buffer, buf]);
            this.offset += buf.length;
        }else if(Array.isArray(buf)){
            buf = Buffer.from(buf);
            this.buffer = Buffer.concat([this.buffer, buf]);
            this.offset += buf.length;
        }
        return this;
    }

    /**
     * Get the read/write offset of the stream
     * @return {number}
     */
    getOffset(): number{
        return this.offset;
    }

    /**
     * Get the stream's buffer
     * @return {Buffer}
     */
    getBuffer() : Buffer{
        return this.buffer;
    }

    /**
     * Shortcut for <BinaryStream>.buffer.length
     * @return {number}
     */
    get length() : number{
        return this.buffer.length;
    }

    /*
     *******************************
     * Buffer Management Functions *
     *******************************
    */

    /**
     * Get the amount of remaining bytes that can be read
     * @return {number}
     */
    getRemainingBytes(){
        return this.buffer.length - this.offset;
    }

    /**
     * Read the remaining amount of bytes
     */
    getRemaining(){
        let buf = this.buffer.slice(this.offset);
        this.offset = this.buffer.length;
        return buf;
    }

    /**
     * Reads a byte boolean
     * @return {boolean}
     */
    getBool(){
        return this.getByte() !== 0;
    }

    /**
     * Writes a byte boolean
     * @param v {boolean}
     * @return {BinaryStream}
     */
    putBool(v: boolean): BinaryStream{
        this.putByte(v === true ? 0x01 : 0x00);
        return this;
    }

    /**
     * Reads a unsigned/signed byte
     * @return {number}
     */
    getByte(): number{
        return this.getBuffer()[this.increaseOffset(1)];
    }

    /**
     * Writes a unsigned/signed byte
     * @param v {number}
     * @return {BinaryStream}
     */
    putByte(v: number): BinaryStream{
        this.append(Buffer.from([v & 0xff]));

        return this;
    }

    /**
     * Reads a 16-bit unsigned or signed big-endian number
     * @return {number}
     */
    getShort(): number{
        return this.buffer.readUInt16BE(this.increaseOffset(2));
    }

    /**
     * Writes a 16-bit unsigned big-endian number
     * @param v {number}
     * @return {BinaryStream}
     */
    putShort(v: number): BinaryStream{
        let buf = Buffer.alloc(2);
        buf.writeUInt16BE(v, 0);
        this.append(buf);

        return this;
    }

    /**
     * Reads a 16-bit signed big-endian number
     * @return {number}
     */
    getSignedShort(): number{
        return this.buffer.readInt16BE(this.increaseOffset(2));
    }

    /**
     * Writes a 16-bit signed big-endian number
     * @param v {number}
     * @return {BinaryStream}
     */
    putSignedShort(v: number): BinaryStream{
        let buf = Buffer.alloc(2);
        buf.writeInt16BE(v, 0);
        this.append(buf);

        return this;
    }

    /**
     * Reads a 16-bit unsigned little-endian number
     * @return {number}
     */
    getLShort(): number{
        return this.buffer.readUInt16LE(this.increaseOffset(2));
    }

    /**
     * Writes a 16-bit unsigned little-endian number
     * @param v {number}
     * @return {BinaryStream}
     */
    putLShort(v:number): BinaryStream{
        let buf = Buffer.alloc(2);
        buf.writeUInt16LE(v, 0);
        this.append(buf);

        return this;
    }

    /**
     * Reads a 16-bit signed little-endian number
     * @return {number}
     */
    getSignedLShort(): number{
        return this.buffer.readInt16LE(this.increaseOffset(2));
    }

    /**
     * Writes a 16-bit signed little-endian number
     * @param v {number}
     * @return {BinaryStream}
     */
    putSignedLShort(v: number): BinaryStream{
        let buf = Buffer.alloc(2);
        buf.writeInt16LE(v, 0);
        this.append(buf);

        return this;
    }

    /**
     * Reads a 3-byte big-endian number
     * @return {number}
     */
    getTriad(): number{
        return this.buffer.readUIntBE(this.increaseOffset(3), 3);
    }

    /**
     * Writes a 3-byte big-endian number
     * @param v {number}
     * @return {BinaryStream}
     */
    putTriad(v: number): BinaryStream{
        let buf = Buffer.alloc(3);
        buf.writeUIntBE(v, 0, 3);
        this.append(buf);

        return this;
    }

    /**
     * Reads a 3-byte little-endian number
     * @return {number}
     */
    getLTriad(): number{
        return this.buffer.readUIntLE(this.increaseOffset(3), 3);
    }

    /**
     * Writes a 3-byte little-endian number
     * @param v {number}
     * @return {BinaryStream}
     */
    putLTriad(v: number): BinaryStream{
        let buf = Buffer.alloc(3);
        buf.writeUIntLE(v, 0, 3);
        this.append(buf);

        return this;
    }

    /**
     * Reads a 32-bit signed big-endian number
     * @return {number}
     */
    getInt(): number{
        return this.buffer.readInt32BE(this.increaseOffset(4));
    }

    /**
     * Writes a 32-bit signed big-endian number
     * @param v {number}
     * @return {BinaryStream}
     */
    putInt(v: number): BinaryStream{
        let buf = Buffer.alloc(4);
        buf.writeInt32BE(v, 0);
        this.append(buf);

        return this;
    }

    /**
     * Reads a 32-bit signed little-endian number
     * @return {number}
     */
    getLInt(): number{
        return this.buffer.readInt32LE(this.increaseOffset(4));
    }

    /**
     * Writes a 32-bit signed little-endian number
     * @param v {number}
     * @return {BinaryStream}
     */
    putLInt(v: number){
        let buf = Buffer.alloc(4);
        buf.writeInt32LE(v, 0);
        this.append(buf);

        return this;
    }

    /**
     * @return {number}
     */
    getFloat(): number{
        return this.buffer.readFloatBE(this.increaseOffset(4));
    }

    // /**
    //  * @param accuracy {number}
    //  * @return {number}
    //  */
    // readRoundedFloat(accuracy: number){
    //     return Round(this.readFloat(), accuracy);
    // }

    /**
     * @param v {number}
     * @return {BinaryStream}
     */
    putFloat(v: number): BinaryStream {
        let buf = Buffer.alloc(8);
        let bytes = buf.writeFloatBE(v, 0);
        this.append(buf.slice(0, bytes));

        return this;
    }

    /**
     * @return {number}
     */
    getLFloat(): number{
        return this.buffer.readFloatLE(this.increaseOffset(4));
    }

    // /**
    //  * @param accuracy {number}
    //  * @return {number}
    //  */
    // readRoundedLFloat(accuracy){
    //     return Round(this.readLFloat(), accuracy);
    // }

    /**
     * @param v {number}
     * @return {BinaryStream}
     */
    putLFloat(v: number): BinaryStream{
        let buf = Buffer.alloc(8);
        let bytes = buf.writeFloatLE(v, 0);
        this.append(buf.slice(0, bytes));

        return this;
    }

    /**
     * @return {number}
     */
    getDouble(): number{
        return this.buffer.readDoubleBE(this.increaseOffset(8));
    }

    /**
     * @param v {number}
     * @return {BinaryStream}
     */
    putDouble(v:number): BinaryStream {
        let buf = Buffer.alloc(8);
        buf.writeDoubleBE(v, 0);
        this.append(buf);

        return this;
    }

    /**
     * @return {number}
     */
    getLDouble(){
        return this.buffer.readDoubleLE(this.increaseOffset(8));
    }

    /**
     * @param v {number}
     * @return {BinaryStream}
     */
    putLDouble(v: number){
        let buf = Buffer.alloc(8);
        buf.writeDoubleLE(v, 0);
        this.append(buf);

        return this;
    }

    /**
     * @return {number}
     */
    getLong(): number{
        return (this.buffer.readUInt32BE(this.increaseOffset(4)) << 8) + this.buffer.readUInt32BE(this.increaseOffset(4));
    }

    /**
     * @param v {number}
     * @return {BinaryStream}
     */
    putLong(v: number): BinaryStream{
        let MAX_UINT32 = 0xFFFFFFFF;

        let buf = Buffer.alloc(8);
        buf.writeUInt32BE((~~(v / MAX_UINT32)), 0);
        buf.writeUInt32BE((v & MAX_UINT32), 4);
        this.append(buf);

        return this;
    }

    // getLLong(){ //WRONG IMPLEMENT!!!
        // return this.buffer.readUInt32LE(0) + (this.buffer.readUInt32LE(4) << 8);
    // }

    putLLong(v): BinaryStream{
        let MAX_UINT32 = 0xFFFFFFFF;

        let buf = Buffer.alloc(8);
        buf.writeUInt32LE((v & MAX_UINT32), 0);
        buf.writeUInt32LE((~~(v / MAX_UINT32)), 4);
        this.append(buf);

        return this;
    }

    /**
     * @return {number}
     */
    getUnsignedVarInt(): number{
        let value = 0;

        for(let i = 0; i <= 35; i += 7){
            let b = this.getByte();
            value |= ((b & 0x7f) << i);

            if((b & 0x80) === 0){
                return value;
            }
        }

        return 0;
    }

    /**
     * @param v {number}
     * @return {BinaryStream}
     */
    putUnsignedVarInt(v: number): BinaryStream{
        let stream = new BinaryStream();

        for(let i = 0; i < 5; i++){
            if((v >> 7) !== 0){
                stream.putByte(v | 0x80);
            }else{
                stream.putByte(v & 0x7f);
                break;
            }
            v >>= 7;
        }

        this.append(stream.buffer);

        return this;
    }

    /**
     * @return {number}
     */
    getVarInt(): number{
        let raw = this.getUnsignedVarInt();
        let tmp = (((raw << 63) >> 63) ^ raw) >> 1;
        return tmp ^ (raw & (1 << 63));
    }

    /**
     * @param v {number}
     * @return {BinaryStream}
     */
    putVarInt(v: number): BinaryStream{
        v <<= 32 >> 32;
        return this.putUnsignedVarInt((v << 1) ^ (v >> 31));
    }

    /**
     * @return {number}
     */
    getUnsignedVarLong(): number{
        let value = 0;
        for(let i = 0; i <= 63; i += 7){
            let b = this.getByte();
            value |= ((b & 0x7f) << i);

            if((b & 0x80) === 0){
                return value;
            }
        }
        return 0;
    }

    /**
     * @param v {number}
     * @return {BinaryStream}
     */
    putUnsignedVarLong(v: number): BinaryStream{
        for(let i = 0; i < 10; i++){
            if((v >> 7) !== 0){
                this.putByte(v | 0x80);
            }else{
                this.putByte(v & 0x7f);
                break;
            }
            v >>= 7;
        }

        return this;
    }

    /**
     * @return {number}
     */
    getVarLong(): number{
        let raw = this.getUnsignedVarLong();
        let tmp = (((raw << 63) >> 63) ^ raw) >> 1;
        return tmp ^ (raw & (1 << 63));
    }

    /**
     * @param v {number}
     * @return {BinaryStream}
     */
    putVarLong(v: number): BinaryStream{
        return this.putUnsignedVarLong((v << 1) ^ (v >> 63));
    }

    // /**
    //  * @return {boolean}
    //  */
    // feof(){
    //     return typeof this.getBuffer()[this.offset] === "undefined";
    // }

    // /**
    //  * Reads address from buffer
    //  * @return {{ip: string, port: number, version: number}}
    //  */
    // readAddress(){
    //     let addr, port;
    //     let version = this.readByte();
    //     switch(version){
    //         default:
    //         case 4:
    //             addr = [];
    //             for(let i = 0; i < 4; i++){
    //                 addr.push(this.readByte() & 0xff);
    //             }
    //             addr = addr.join(".");
    //             port = this.readShort();
    //             break;
    //         // add ipv6 support
    //     }
    //     return {ip: addr, port: port, version: version};
    // }

    // /**
    //  * Writes address to buffer
    //  * @param addr    {string}
    //  * @param port    {number}
    //  * @param version {number}
    //  * @return {BinaryStream}
    //  */
    // writeAddress(addr, port, version = 4){
    //     this.writeByte(version);
    //     switch(version){
    //         default:
    //         case 4:
    //             addr.split(".", 4).forEach(b => this.writeByte((Number(b)) & 0xff));
    //             this.writeShort(port);
    //             break;
    //     }
    //     return this;
    // }

    /**
     * @param v {string}
     * @return {BinaryStream}
     */
    putString(v:string): BinaryStream{
        this.append(Buffer.from(v, "utf8"));
        return this;
    }

    flip(): BinaryStream{
        this.offset = 0;
        return this;
    }

    // /**
    //  * @param spaces {boolean}
    //  */
    // toHex(spaces = false){
    //     let hex = this.buffer.toString("hex");
    //     return spaces ? hex.split(/(..)/).filter(v => v !== "").join(" ") : hex;
    // }
}


export {BinaryStream}