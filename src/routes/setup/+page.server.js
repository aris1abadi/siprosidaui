import { writeFileSync } from 'fs';
import { fail } from '@sveltejs/kit';
import { writeFile } from 'node:fs/promises';
import { extname } from 'path';

 
export const actions = {
    default: async ({ request }) => {       

        const formData = await request.formData();
        console.log(formData)
        const uploadedFile = formData?.get('fileToUpload');
        const kontrolID = formData?.get('kontrolID')
        
        const filename = `upload/${kontrolID}_firmware.bin`;
        console.log('simpan ' + filename)
        await writeFile(filename, Buffer.from(await uploadedFile?.arrayBuffer()));
        return {
            status: 200,  
            pesan: 'File berhasil disimpan',  
            path : filename,      
            
          };
  }
}