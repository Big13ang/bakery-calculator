import { useRouter } from 'expo-router';
import { ScrollView, View } from 'react-native';
import { Screen } from '../components/layout/Screen';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Icons } from '../components/ui/Icons';
import { Typography } from '../components/ui/Typography';

export const PrivacyPolicyScreen = () => {
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
                    <Typography variant="h2">سیاست حریم خصوصی</Typography>
                    <Typography variant="micro" className="opacity-50 tracking-widest text-[9px]">Privacy Policy</Typography>
                </View>
            </View>

            <ScrollView className="flex-1 px-4 pb-12" contentContainerStyle={{ paddingBottom: 40 }}>
                <Card className="mb-6">
                    <Typography variant="body" className="leading-7 text-justify">
                        ما در برنامه «عمو قناد» به حریم خصوصی شما اهمیت زیادی می‌دهیم. این سند توضیح می‌دهد که داده‌های شما چگونه مدیریت می‌شوند.
                    </Typography>
                </Card>

                <View className="gap-y-6">
                    <View className="gap-y-2">
                        <Typography variant="caption" className="font-black text-bakery-accent capitalize text-[14px]">۱. کاملاً آفلاین</Typography>
                        <Card>
                            <Typography variant="body" className="leading-7 text-justify">
                                این برنامه به صورت کاملاً آفلاین (Offline) کار می‌کند. تمامی اطلاعات وارد شده توسط شما، اعم از مواد اولیه، دستور پخت‌ها و قیمت‌ها، صرفاً در حافظه داخلی دستگاه شما ذخیره می‌شوند.
                            </Typography>
                        </Card>
                    </View>

                    <View className="gap-y-2">
                        <Typography variant="caption" className="font-black text-bakery-accent capitalize text-[14px]">۲. عدم دسترسی به داده‌ها</Typography>
                        <Card>
                            <Typography variant="body" className="leading-7 text-justify">
                                ما (تیم اپ‌ساز) هیچ‌گونه دسترسی به داده‌های شما نداریم. هیچ داده‌ای به سرورهای ما ارسال نمی‌شود و ما قادر به مشاهده یا بازیابی اطلاعات شما نیستیم.
                            </Typography>
                        </Card>
                    </View>

                    <View className="gap-y-2">
                        <Typography variant="caption" className="font-black text-bakery-accent capitalize text-[14px]">۳. مسئولیت نگهداری داده‌ها</Typography>
                        <Card>
                            <Typography variant="body" className="leading-7 text-justify">
                                از آنجا که داده‌ها فقط روی گوشی شما هستند، در صورت حذف برنامه یا بروز مشکل برای دستگاه، مسئولیت از دست رفتن اطلاعات بر عهده کاربر است. برای جلوگیری از این موضوع، می‌توانید از قابلیت «خروجی اطلاعات» در بخش تنظیمات برای تهیه نسخه پشتیبان استفاده کنید.
                            </Typography>
                        </Card>
                    </View>

                    <View className="gap-y-2">
                        <Typography variant="caption" className="font-black text-bakery-accent capitalize text-[14px]">۴. مجوزهای برنامه</Typography>
                        <Card>
                            <Typography variant="body" className="leading-7 text-justify">
                                برنامه ممکن است برای ذخیره یا فراخوانی فایل‌های پشتیبان، به دسترسی حافظه نیاز داشته باشد. این دسترسی صرفاً برای انجام عملیات مورد درخواست شما استفاده می‌شود.
                            </Typography>
                        </Card>
                    </View>
                </View>

                <View className="items-center py-10 opacity-40">
                    <Typography variant="micro">آخرین بروزرسانی: بهمن ۱۴۰۴</Typography>
                </View>
            </ScrollView>
        </Screen>
    );
};
