import { useRouter } from 'expo-router';
import { ScrollView, View } from 'react-native';
import { Screen } from '../components/layout/Screen';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Icons } from '../components/ui/Icons';
import { Typography } from '../components/ui/Typography';

export const TermsOfServiceScreen = () => {
    const router = useRouter();

    return (
        <Screen className="flex-1">
            <View className="p-4 pt-8 flex-row items-center gap-4">
                <Button
                    variant="ghost"
                    onPress={() => router.back()}
                    icon={<Icons.ChevronRight size={24} color="#4A3728" />}
                    className="w-12 h-12 rounded-full"
                />
                <View>
                    <Typography variant="h2">شرایط و ضوابط</Typography>
                    <Typography variant="micro" className="opacity-50 tracking-widest text-[9px]">Terms of Service</Typography>
                </View>
            </View>

            <ScrollView className="flex-1 px-4 pb-12" contentContainerStyle={{ paddingBottom: 40 }}>
                <Card className="mb-6">
                    <Typography variant="body" className="leading-7 text-justify">
                        استفاده از برنامه «عمو قناد» به معنای پذیرش تمامی موارد ذکر شده در این سند می‌باشد.
                    </Typography>
                </Card>

                <View className="gap-y-6">
                    <View className="gap-y-2">
                        <Typography variant="caption" className="font-black text-bakery-accent capitalize text-[14px]">۱. کپی‌رایت و مالکیت معنوی</Typography>
                        <Card>
                            <Typography variant="body" className="leading-7 text-justify">
                                تمامی حقوق مادی و معنوی این اپلیکیشن، شامل کدها، طراحی بصری و نام تجاری، متعلق به تیم اپ‌ساز به نشانی appsaz.ir می‌باشد. هرگونه کپی‌برداری یا بازنشر بدون اجازه کتبی پیگرد قانونی دارد.
                            </Typography>
                        </Card>
                    </View>

                    <View className="gap-y-2">
                        <Typography variant="caption" className="font-black text-bakery-accent capitalize text-[14px]">۲. شرایط استفاده</Typography>
                        <Card>
                            <Typography variant="body" className="leading-7 text-justify">
                                این برنامه صرفاً برای کمک به محاسبات هزینه‌های تولیدی طراحی شده است. دقت محاسبات بستگی مستقیم به دقت داده‌های وارد شده توسط کاربر دارد.
                            </Typography>
                        </Card>
                    </View>

                    <View className="gap-y-2">
                        <Typography variant="caption" className="font-black text-bakery-accent capitalize text-[14px]">۳. تغییرات در برنامه</Typography>
                        <Card>
                            <Typography variant="body" className="leading-7 text-justify">
                                تیم اپ‌ساز حق دارد در هر زمان، نسبت به بروزرسانی، تغییر قابلیت‌ها یا توقف ارائه خدمات برنامه اقدام نماید.
                            </Typography>
                        </Card>
                    </View>

                    <View className="gap-y-2">
                        <Typography variant="caption" className="font-black text-bakery-accent capitalize text-[14px]">۴. تماس با ما</Typography>
                        <Card>
                            <Typography variant="body" className="leading-7 text-justify">
                                در صورت داشتن هرگونه سوال یا پیشنهاد، می‌توانید از طریق وب‌سایت appsaz.ir با ما در ارتباط باشید.
                            </Typography>
                        </Card>
                    </View>
                </View>

                <View className="items-center py-10 opacity-40">
                    <Typography variant="micro">© ۲۰۲۶ تمامی حقوق محفوظ است</Typography>
                </View>
            </ScrollView>
        </Screen>
    );
};
