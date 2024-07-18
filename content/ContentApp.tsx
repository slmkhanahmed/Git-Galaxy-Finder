import React from 'react'
import { Box, FormControl, TextInput } from '@primer/react'
import './content.css'
import './a.tsx'
export default function ContentApp() {

  return (
    <div>
      <Box as="form">
    <FormControl>
      <FormControl.Label visuallyHidden>Default label</FormControl.Label>
      <TextInput />
    </FormControl>
  </Box>
    </div>
  )
}
