import React from 'react'
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const LectureTab = () => {
    return (
        <Card>
            <CardHeader className='flex  justify-between'>
                <div>
                    <CardTitle>Edit Lecture</CardTitle>
                    <CardDescription>
                        Make Changes to your lectures here. Click save when you are done.
                    </CardDescription>
                </div>
                <div className='flex items-center gap-2'>
                    <Button variant="destructive">Remove Lecture</Button>
                </div>
            </CardHeader>
            <CardContent>
                <div>
                    <Label>Title</Label>
                    <Input
                        type='text'
                        placeholder='Your TItle Name'
                    />
                </div>
            </CardContent>

        </Card>
    )
}

export default LectureTab